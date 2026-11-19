import Peer, { type DataConnection } from 'peerjs';
import { useEffect, useState } from 'react';

/**
 * Peer-to-peer link between devices (WebRTC via PeerJS).
 * The deck window hosts a short code; a presenter view on another device joins with it.
 * Slide position and controls then travel directly between the two browsers.
 */

export interface DeckPos { mode: 'a' | 'h'; index: number }
export type CtlMsg = { type: 'black'; on: boolean } | { type: 'reset' };
type Msg = ({ t: 'state' } & DeckPos) | ({ t: 'ctl' } & CtlMsg);

export interface LinkStatus {
  role: 'host' | 'guest' | null;
  code: string | null;
  peers: number;
  state: 'idle' | 'starting' | 'waiting' | 'connecting' | 'connected' | 'error';
  error?: string;
}

const PREFIX = 'ignite26-';
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no look-alikes (0/O, 1/I/L)
const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => ALPHABET[b % ALPHABET.length]).join('');

const conns = new Set<DataConnection>();
const posListeners = new Set<(p: DeckPos) => void>();
const ctlListeners = new Set<(c: CtlMsg) => void>();
const statusListeners = new Set<() => void>();

let peer: Peer | null = null;
let lastPos: DeckPos | null = null;
let wantedCode: string | null = null; // guest: keep reconnecting while set
let status: LinkStatus = { role: null, code: null, peers: 0, state: 'idle' };

function setStatus(patch: Partial<LinkStatus>) {
  status = { ...status, ...patch, peers: conns.size };
  statusListeners.forEach((f) => f());
}

const ctlChannel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('ignite26-ctl');
if (ctlChannel) ctlChannel.onmessage = (e: MessageEvent<CtlMsg>) => ctlListeners.forEach((f) => f(e.data));

function broadcast(m: Msg) {
  conns.forEach((c) => { if (c.open) c.send(m); });
}

/** Tell other devices the deck moved. */
export function sendPos(p: DeckPos) {
  lastPos = p;
  broadcast({ t: 'state', ...p });
}

/** Send a control (black screen, reset) to the deck window: same browser and linked devices. */
export function sendCtl(c: CtlMsg) {
  ctlChannel?.postMessage(c);
  broadcast({ t: 'ctl', ...c });
}

export const onPos = (f: (p: DeckPos) => void) => { posListeners.add(f); return () => { posListeners.delete(f); }; };
export const onCtl = (f: (c: CtlMsg) => void) => { ctlListeners.add(f); return () => { ctlListeners.delete(f); }; };

function wire(conn: DataConnection) {
  conn.on('open', () => {
    conns.add(conn);
    if (status.role === 'host' && lastPos) conn.send({ t: 'state', ...lastPos } satisfies Msg);
    setStatus({ state: 'connected' });
  });
  conn.on('data', (raw) => {
    const m = raw as Msg;
    if (m?.t === 'state' && (m.mode === 'a' || m.mode === 'h') && Number.isInteger(m.index)) posListeners.forEach((f) => f({ mode: m.mode, index: m.index }));
    else if (m?.t === 'ctl') ctlListeners.forEach((f) => f(m as CtlMsg));
  });
  const gone = () => {
    conns.delete(conn);
    setStatus({ state: status.role === 'host' ? 'waiting' : 'connecting' });
    if (status.role === 'guest' && wantedCode) setTimeout(() => { if (wantedCode && conns.size === 0) void join(wantedCode); }, 2500);
  };
  conn.on('close', gone);
  conn.on('error', gone);
}

function reset() {
  conns.forEach((c) => c.close());
  conns.clear();
  peer?.destroy();
  peer = null;
}

/** Deck window: start accepting devices. Safe to call repeatedly. */
export async function host(): Promise<string> {
  if (status.role === 'host' && status.code) return status.code;
  reset();
  wantedCode = null;
  setStatus({ role: 'host', code: null, state: 'starting', error: undefined });
  for (let attempt = 0; attempt < 4; attempt++) {
    const code = newCode();
    try {
      await new Promise<void>((resolve, reject) => {
        const p = new Peer(PREFIX + code);
        p.on('open', () => { peer = p; resolve(); });
        p.on('error', (e) => reject(e));
      });
      peer!.on('connection', wire);
      peer!.on('error', () => setStatus({ state: 'error', error: 'Connection to the pairing service was lost.' }));
      setStatus({ code, state: 'waiting' });
      return code;
    } catch { /* id taken or service busy: try another code */ }
  }
  setStatus({ state: 'error', error: 'Could not reach the pairing service. Check the network and try again.' });
  throw new Error('host failed');
}

/** Presenter view on another device: join a deck by code. */
export async function join(rawCode: string): Promise<void> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return;
  wantedCode = code;
  if (peer && status.role === 'guest' && status.code === code && conns.size > 0) return;
  reset();
  setStatus({ role: 'guest', code, state: 'connecting', error: undefined });
  try {
    await new Promise<void>((resolve, reject) => {
      const p = new Peer();
      p.on('open', () => { peer = p; resolve(); });
      p.on('error', (e) => reject(e));
    });
    peer!.on('error', (e) => setStatus({ state: 'error', error: e.type === 'peer-unavailable' ? 'No deck found for that code. Is the main window open and paired?' : 'Connection error.' }));
    wire(peer!.connect(PREFIX + code, { reliable: true }));
  } catch {
    setStatus({ state: 'error', error: 'Could not reach the pairing service.' });
  }
}

export function leave() {
  wantedCode = null;
  reset();
  lastPos = null;
  setStatus({ role: null, code: null, state: 'idle', error: undefined });
}

export function useLink(): LinkStatus {
  const [s, setS] = useState(status);
  useEffect(() => {
    const f = () => setS(status);
    statusListeners.add(f);
    f();
    return () => { statusListeners.delete(f); };
  }, []);
  return s;
}
