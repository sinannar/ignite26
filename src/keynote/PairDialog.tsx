import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { formatCode, host, leave, sendPos, useLink } from './link';
import type { useDeck } from './useDeck';

export function PairDialog({ d, onClose }: { d: ReturnType<typeof useDeck>; onClose: () => void }) {
  const link = useLink();
  const [qr, setQr] = useState('');

  const on = link.role === 'host';
  const turnOn = () => { host().then(() => sendPos({ mode: d.mode, index: d.index })).catch(() => {}); };

  const url = link.code ? `${window.location.origin}${import.meta.env.BASE_URL}?presenter=1&join=${link.code}` : '';
  useEffect(() => {
    if (!url) return;
    QRCode.toDataURL(url, { margin: 1, width: 360, color: { dark: '#0a0d16', light: '#ffffff' } }).then(setQr).catch(() => setQr(''));
  }, [url]);

  const stateText = link.state === 'connected' ? `Connected: ${link.peers} device${link.peers === 1 ? '' : 's'}`
    : link.state === 'error' ? (link.error ?? 'Something went wrong') : link.state === 'starting' ? 'Getting a code…' : 'Waiting for a device…';

  return (
    <div className="overlay" onClick={onClose}>
      <div className="dialog pair" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Close">✕</button>
        <h2>Remote control</h2>
        <p className="pair-sub">Off by default. Turn it on to let a phone or tablet drive this deck and show your notes.</p>
        <label className="pair-switch">
          <input type="checkbox" role="switch" checked={on} onChange={() => (on ? leave() : turnOn())} />
          <span>{on ? 'On' : 'Off'}</span>
        </label>
        {!on && <p className="pair-note">While it is off nothing connects to the pairing service and nobody can control this deck.</p>}
        {on && <div className="pair-grid">
          <div className="pair-qr">{qr ? <img src={qr} alt="QR code to pair" width={220} height={220} /> : <div className="pair-qr-empty" />}</div>
          <div>
            <small>Code</small>
            <div className="pair-code">{link.code ? formatCode(link.code) : '····-····'}</div>
            <small>Or open</small>
            <p className="pair-url">{url || '…'}</p>
            <p className={`pair-state ${link.state}`}>{stateText}</p>
            <div className="pair-actions">
              <button onClick={() => { leave(); turnOn(); }}>New code</button>
              {url && <button onClick={() => void navigator.clipboard?.writeText(url)}>Copy link</button>}
            </div>
          </div>
        </div>}
        {on && /^(localhost|127\.|\[::1\])/.test(window.location.hostname) && <p className="pair-warn">This deck is open on <b>{window.location.host}</b>, an address only this computer can reach. Open the published site (https) on the computer, or the computer's network address, so the QR works on your phone.</p>}
        {on && <p className="pair-note">It goes through a free public relay (nothing is stored except the slide number). Anyone with the code can control this deck while it is open, so share it only with your own device. Test once on the venue network before you go on stage.</p>}
      </div>
    </div>
  );
}
