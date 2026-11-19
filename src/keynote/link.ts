import mqtt, { type MqttClient } from 'mqtt';
import { useEffect, useState } from 'react';

/**
 * Remote control between devices, with no account and no server of ours.
 * Both ends talk through a free public MQTT broker over WebSocket (works on any network that allows HTTPS-style
 * traffic, unlike direct WebRTC). The topic is derived from the pairing code with PBKDF2, so the code itself never
 * appears on the broker and sniffing topics does not reveal it. Only slide position and controls are sent.
 */

export interface DeckPos { mode: 'a' | 'h'; index: number }
export type CtlMsg = { type: 'black'; on: boolean } | { type: 'reset' };

export interface LinkStatus {
  role: 'host' | 'guest' | null;
  code: string | null;
  peers: number;
  state: 'idle' | 'starting' | 'waiting' | 'connecting' | 'connected' | 'error';
  error?: string;
  /** Broker in use, for troubleshooting. */
  via?: string;
}

// Public, unauthenticated brokers. Tried in order; the first that connects wins.
const BROKERS = ['wss://broker.emqx.io:8084/mqtt', 'wss://broker.hivemq.com:8884/mqtt', 'wss://test.mosquitto.org:8081'];
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no look-alikes (0/O, 1/I/L)
const CODE_LEN = 8;
const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(CODE_LEN)), (b) => ALPHABET[b % ALPHABET.length]).join('');
const myId = Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => b.toString(16).padStart(2, '0')).join('');

export const normalizeCode = (raw: string) => raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
export const formatCode = (c: string) => (c.length === CODE_LEN ? `${c.slice(0, 4)}-${c.slice(4)}` : c);

async function topicFor(code: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(code), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', iterations: 100_000, salt: new TextEncoder().encode('ignite26-remote-v1') }, key, 128);
  return 'ignite26/' + Array.from(new Uint8Array(bits), (b) => b.toString(16).padStart(2, '0')).join('');
}

const posListeners = new Set<(p: DeckPos) => void>();
const ctlListeners = new Set<(c: CtlMsg) => void>();
const statusListeners = new Set<() => void>();

let client: MqttClient | null = null;
let topic = '';
let guests = new Set<string>();
let presenceTimer: ReturnType<typeof setTimeout> | undefined;
let status: LinkStatus = { role: null, code: null, peers: 0, state: 'idle' };

function setStatus(patch: Partial<LinkStatus>) {
  status = { ...status, ...patch };
  statusListeners.forEach((f) => f());
}

const ctlChannel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('ignite26-ctl');
if (ctlChannel) ctlChannel.onmessage = (e: MessageEvent<CtlMsg>) => ctlListeners.forEach((f) => f(e.data));

const pub = (sub: string, payload: unknown, retain = false) => {
  if (client?.connected) client.publish(`${topic}/${sub}`, typeof payload === 'string' ? payload : JSON.stringify(payload), { qos: 0, retain });
};

/** Tell other devices the deck moved. */
export function sendPos(p: DeckPos) {
  if (status.role === 'host') pub('s', { o: 'host', ...p }, true);
  else if (status.role === 'guest') pub('c', { o: myId, t: 'state', ...p });
}

/** Send a control (black screen, reset) to the deck: same browser (BroadcastChannel) and linked devices. */
export function sendCtl(c: CtlMsg) {
  ctlChannel?.postMessage(c);
  if (status.role === 'guest') pub('c', { o: myId, t: 'ctl', ...c });
}

export const onPos = (f: (p: DeckPos) => void) => { posListeners.add(f); return () => { posListeners.delete(f); }; };
export const onCtl = (f: (c: CtlMsg) => void) => { ctlListeners.add(f); return () => { ctlListeners.delete(f); }; };

const validPos = (m: any): boolean => !!m && (m.mode === 'a' || m.mode === 'h') && Number.isInteger(m.index) && m.index >= 0 && m.index < 10_000;

/** Connect to the first broker that answers. */
async function connect(will?: { topic: string; payload: string; retain: boolean }): Promise<MqttClient> {
  for (const url of BROKERS) {
    const c = await new Promise<MqttClient | null>((resolve) => {
      const cl = mqtt.connect(url, { clientId: `ig26-${myId}-${Math.random().toString(16).slice(2, 6)}`, connectTimeout: 6000, reconnectPeriod: 0, clean: true, keepalive: 30, will: will ? { ...will, qos: 0 } : undefined });
      const fail = () => { cl.removeAllListeners(); cl.end(true); resolve(null); };
      cl.once('connect', () => { cl.removeListener('error', fail); cl.removeListener('close', fail); cl.options.reconnectPeriod = 2000; resolve(cl); });
      cl.once('error', fail);
      cl.once('close', fail);
    });
    if (c) { setStatus({ via: new URL(url.replace('wss', 'https')).hostname }); return c; }
  }
  throw new Error('no broker');
}

function teardown(clearRetained: boolean) {
  clearTimeout(presenceTimer);
  if (client) {
    if (clearRetained && client.connected && status.role === 'host') {
      client.publish(`${topic}/p`, 'off', { retain: true });
      client.publish(`${topic}/s`, '', { retain: true });
    }
    client.removeAllListeners();
    client.end(true);
  }
  client = null;
  guests = new Set();
}

/** Deck window: start accepting devices. Safe to call repeatedly. */
export async function host(): Promise<string> {
  if (status.role === 'host' && status.code) return status.code;
  teardown(false);
  setStatus({ role: 'host', code: null, peers: 0, state: 'starting', error: undefined });
  const code = newCode();
  try {
    topic = await topicFor(code);
    const c = await connect({ topic: `${topic}/p`, payload: 'off', retain: true });
    client = c;
    c.subscribe([`${topic}/c`, `${topic}/g/+`]);
    pub('p', 'on', true);
    c.on('message', (t, buf) => {
      const sub = t.slice(topic.length + 1);
      const text = buf.toString();
      if (sub.startsWith('g/')) {
        const id = sub.slice(2);
        if (text) guests.add(id); else guests.delete(id);
        setStatus({ peers: guests.size, state: guests.size ? 'connected' : 'waiting' });
        return;
      }
      try {
        const m = JSON.parse(text);
        if (m.t === 'state' && validPos(m)) {
          posListeners.forEach((f) => f({ mode: m.mode, index: m.index }));
          pub('s', { o: m.o, mode: m.mode, index: m.index }, true); // keep the retained state current
        } else if (m.t === 'ctl' && (m.type === 'black' || m.type === 'reset')) ctlListeners.forEach((f) => f(m as CtlMsg));
      } catch { /* ignore malformed */ }
    });
    c.on('connect', () => { pub('p', 'on', true); c.subscribe([`${topic}/c`, `${topic}/g/+`]); }); // after an automatic reconnect
    c.on('close', () => setStatus({ state: 'error', error: 'Lost the connection to the relay. Reconnecting…' }));
    c.on('connect', () => setStatus({ state: guests.size ? 'connected' : 'waiting', error: undefined }));
    setStatus({ code, state: 'waiting' });
    return code;
  } catch {
    setStatus({ state: 'error', error: 'Could not reach a relay. Check the network and try again.' });
    throw new Error('host failed');
  }
}

/** Presenter view on another device: join a deck by code. */
export async function join(rawCode: string): Promise<void> {
  const code = normalizeCode(rawCode);
  if (code.length !== CODE_LEN) { setStatus({ role: 'guest', code, state: 'error', error: `The code has ${CODE_LEN} letters and numbers.` }); return; }
  if (status.role === 'guest' && status.code === code && client) return;
  teardown(false);
  setStatus({ role: 'guest', code, peers: 0, state: 'connecting', error: undefined });
  try {
    topic = await topicFor(code);
    const c = await connect({ topic: `${topic}/g/${myId}`, payload: '', retain: true });
    client = c;
    const subscribe = () => {
      c.subscribe([`${topic}/s`, `${topic}/p`]);
      c.publish(`${topic}/g/${myId}`, '1', { retain: true });
      clearTimeout(presenceTimer);
      presenceTimer = setTimeout(() => { if (status.state !== 'connected') setStatus({ state: 'error', error: 'No deck found for that code. Is the deck open with Remote control on?' }); }, 7000);
    };
    subscribe();
    c.on('connect', () => { subscribe(); });
    c.on('close', () => setStatus({ state: 'connecting' }));
    c.on('message', (t, buf) => {
      const sub = t.slice(topic.length + 1);
      const text = buf.toString();
      if (sub === 'p') { setStatus(text === 'on' ? { state: 'connected', error: undefined } : { state: 'connecting' }); return; }
      if (sub === 's' && text) {
        try { const m = JSON.parse(text); if (m.o !== myId && validPos(m)) posListeners.forEach((f) => f({ mode: m.mode, index: m.index })); } catch { /* ignore */ }
      }
    });
  } catch {
    setStatus({ state: 'error', error: 'Could not reach a relay. Check the network and try again.' });
  }
}

export function leave() {
  teardown(true);
  setStatus({ role: null, code: null, peers: 0, state: 'idle', error: undefined, via: undefined });
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
