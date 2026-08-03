'use client';
import { useEffect, useState, useCallback } from 'react';
import { stopSosAlarm } from '@/lib/sosAlarm';

interface SOSModalProps {
  onDismiss: () => void;
  userName?: string;
  busId?: string;
  location?: string;
}

const CONTACTS = [
  { name: 'College Security',  phone: '0422-123456',     icon: '🏫' },
  { name: 'Transport Office',  phone: '0422-234567',     icon: '🚌' },
  { name: 'Police Control',    phone: '100',             icon: '👮' },
  { name: 'Emergency Contact', phone: '+91 98765 00001', icon: '👨‍👩‍👧' },
];

type Phase = 'active' | 'responding' | 'confirming' | 'resolving' | 'resolved';

export default function SOSModal({
  onDismiss,
  userName = 'Priya Sharma',
  busId = 'BUS-01',
  location = 'Town Hall Stop',
}: SOSModalProps) {
  const [elapsed, setElapsed]       = useState(0);
  const [contactIdx, setContactIdx] = useState(0);
  const [phase, setPhase]           = useState<Phase>('active');
  const [muted, setMuted]           = useState(false);

  useEffect(() => {
    if (phase === 'resolving' || phase === 'resolved' || phase === 'confirming') return;
    const t  = setInterval(() => setElapsed(p => p + 1), 1000);
    const c1 = setTimeout(() => setContactIdx(1), 1200);
    const c2 = setTimeout(() => setContactIdx(2), 2800);
    const c3 = setTimeout(() => setContactIdx(3), 4500);
    const p1 = setTimeout(() => setPhase(prev => prev === 'active' ? 'responding' : prev), 6000);
    return () => { clearInterval(t); clearTimeout(c1); clearTimeout(c2); clearTimeout(c3); clearTimeout(p1); };
  }, [phase]);

  const handleMute           = useCallback(() => { setMuted(true); stopSosAlarm(); }, []);
  const handleCancelRequest  = useCallback(() => setPhase('confirming'), []);
  const handleContinue       = useCallback(() => setPhase(elapsed >= 6 ? 'responding' : 'active'), [elapsed]);
  const handleConfirmedCancel = useCallback(() => {
    stopSosAlarm(); setMuted(true); setPhase('resolving');
    setTimeout(() => { setPhase('resolved'); setTimeout(onDismiss, 2000); }, 500);
  }, [onDismiss]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  /* ── RESOLVED ── */
  if (phase === 'resolved') {
    return (
      <div className="sos-overlay">
        <div className="sos-resolved-card">
          <div className="sos-check">✓</div>
          <h2 className="sos-resolved-title">Emergency Resolved</h2>
          <p className="sos-resolved-sub">All contacts have been notified that the emergency has been resolved.</p>
          <p className="sos-resolved-hint">Closing automatically…</p>
        </div>
        <style>{SOS_STYLES}</style>
      </div>
    );
  }

  return (
    <div className="sos-overlay">
      {/* Ambient pulse */}
      {phase !== 'confirming' && phase !== 'resolving' && (
        <div className="sos-ambient" />
      )}

      {/* ── MODAL WRAPPER: fixed height, flex column ── */}
      <div className="sos-modal" style={{opacity: phase === 'resolving' ? 0.5 : 1}}>

        {/* HEADER */}
        <div className="sos-header">
          <div className="sos-icon-wrap">
            <div className="sos-ring sos-ring-1" />
            <div className="sos-ring sos-ring-2" />
            <div className="sos-icon-btn">SOS</div>
          </div>
          <h2 className="sos-title">Emergency Alert Active</h2>
          <p className="sos-subtitle">Help is being dispatched to your location</p>
          <div className="sos-timer">
            <span className="sos-timer-dot" />
            <span className="sos-timer-text">{fmt(elapsed)}</span>
            <span className="sos-timer-label">elapsed</span>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="sos-body">
          {/* Info */}
          <div className="sos-info-row">
            {[{label:'Student',value:userName,icon:'👤'},{label:'Bus',value:busId,icon:'🚌'},{label:'Location',value:location,icon:'📍'}].map(i => (
              <div key={i.label} className="sos-info-cell">
                <span className="sos-info-icon">{i.icon}</span>
                <span className="sos-info-value">{i.value}</span>
                <span className="sos-info-label">{i.label}</span>
              </div>
            ))}
          </div>

          {/* Contacts */}
          <div className="sos-contacts">
            <p className="sos-contacts-heading">Notifying Emergency Contacts</p>
            {CONTACTS.map((c, i) => (
              <div key={c.name} className={`sos-contact ${i <= contactIdx ? 'sos-contact--active' : ''}`}>
                <span className="sos-contact-icon">{c.icon}</span>
                <div className="sos-contact-info">
                  <span className="sos-contact-name">{c.name}</span>
                  <span className="sos-contact-phone">{c.phone}</span>
                </div>
                <span className="sos-contact-status">
                  {i <= contactIdx ? (i < contactIdx ? '✓ Done' : 'Alerting…') : 'Pending'}
                </span>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className={`sos-status ${phase === 'responding' ? 'sos-status--ok' : ''}`}>
            {phase === 'responding'
              ? '✅ Response team dispatched — Help is on the way'
              : '🚨 Emergency services being contacted…'}
          </div>
        </div>

        {/* FOOTER — always rendered, never conditional */}
        <div className="sos-footer">
          <button
            className="sos-btn-stop"
            onClick={handleCancelRequest}
            disabled={phase === 'resolving'}
          >
            🛑 Stop Emergency Alert
          </button>
          <button
            className="sos-btn-mute"
            onClick={handleMute}
            disabled={muted || phase === 'resolving'}
          >
            {muted ? '🔇 Alarm Muted' : '🔇 Mute Alarm Only'}
          </button>
          <p className="sos-footer-hint">
            Stopping the alert notifies all contacts the emergency is resolved.
          </p>
        </div>

      </div>

      {/* CONFIRMATION OVERLAY */}
      {phase === 'confirming' && (
        <div className="sos-confirm-overlay">
          <div className="sos-confirm-card">
            <div className="sos-confirm-icon">⚠️</div>
            <h3 className="sos-confirm-title">Stop Emergency Alert?</h3>
            <p className="sos-confirm-body">
              This will stop the alarm and notify all contacts that the emergency has been resolved.
              Only cancel if you are safe.
            </p>
            <button className="sos-confirm-safe" onClick={handleConfirmedCancel}>
              ✅ Yes, I'm Safe — Stop Alert
            </button>
            <button className="sos-confirm-continue" onClick={handleContinue}>
              🚨 Continue Emergency
            </button>
          </div>
        </div>
      )}

      <style>{SOS_STYLES}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ALL STYLES IN ONE PLACE — no Tailwind, no overrides
───────────────────────────────────────────────────────── */
const SOS_STYLES = `
  .sos-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(0,0,0,0.80);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .sos-ambient {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(ellipse at center, rgba(239,68,68,0.13) 0%, transparent 70%);
    animation: sosPulseOverlay 1s ease-in-out infinite alternate;
  }

  /* ── MODAL: explicit height so footer is always visible ── */
  .sos-modal {
    position: relative;
    width: 100%;
    max-width: 420px;
    /* Use fixed viewport-relative height */
    height: 88vh;
    max-height: 600px;
    display: flex;
    flex-direction: column;
    border-radius: 24px;
    overflow: hidden;
    background: linear-gradient(135deg, #1a0505, #0f0000);
    border: 1px solid rgba(239,68,68,0.4);
    box-shadow: 0 32px 80px rgba(239,68,68,0.4);
    transition: opacity 0.5s ease;
  }

  /* HEADER */
  .sos-header {
    flex-shrink: 0;
    padding: 20px 20px 14px;
    text-align: center;
    background: linear-gradient(180deg, rgba(239,68,68,0.2) 0%, transparent 100%);
    border-bottom: 1px solid rgba(239,68,68,0.18);
  }
  .sos-icon-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    width: 72px;
    height: 72px;
  }
  .sos-ring {
    position: absolute;
    border-radius: 50%;
    animation: sosPing 1.4s cubic-bezier(0,0,0.2,1) infinite;
  }
  .sos-ring-1 { width:72px; height:72px; background:rgba(239,68,68,0.2); }
  .sos-ring-2 { width:60px; height:60px; background:rgba(239,68,68,0.28); animation-delay:0.35s; }
  .sos-icon-btn {
    position: relative;
    z-index: 1;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #dc2626;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 900;
    font-size: 15px;
    box-shadow: 0 0 28px rgba(239,68,68,0.8);
  }
  .sos-title   { color:#fff; font-weight:900; font-size:17px; margin:0 0 3px; }
  .sos-subtitle{ color:#fca5a5; font-size:12px; margin:0 0 10px; }
  .sos-timer {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(239,68,68,0.2);
    border-radius: 100px;
    padding: 4px 14px;
    border: 1px solid rgba(239,68,68,0.3);
  }
  .sos-timer-dot  { width:7px; height:7px; border-radius:50%; background:#f87171; animation:sosDotPulse 2s ease-in-out infinite; display:inline-block; }
  .sos-timer-text { color:#fca5a5; font-family:monospace; font-weight:700; font-size:14px; }
  .sos-timer-label{ color:rgba(252,165,165,0.5); font-size:10px; }

  /* BODY */
  .sos-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(239,68,68,0.35) transparent;
  }
  .sos-body::-webkit-scrollbar { width: 3px; }
  .sos-body::-webkit-scrollbar-thumb { background: rgba(239,68,68,0.35); border-radius: 2px; }

  .sos-info-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    padding: 12px 20px;
    border-bottom: 1px solid rgba(239,68,68,0.14);
  }
  .sos-info-cell { text-align:center; }
  .sos-info-icon { display:block; font-size:15px; margin-bottom:2px; }
  .sos-info-value{ display:block; color:#fff; font-size:11px; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .sos-info-label{ display:block; color:rgba(252,165,165,0.5); font-size:9px; }

  .sos-contacts { padding: 12px 20px; border-bottom: 1px solid rgba(239,68,68,0.14); }
  .sos-contacts-heading { color:rgba(252,165,165,0.55); font-size:10px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; margin-bottom:8px; }
  .sos-contact {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 12px;
    margin-bottom: 6px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    opacity: 0.35;
    transition: all 0.5s ease;
  }
  .sos-contact--active { background:rgba(239,68,68,0.12); border-color:rgba(239,68,68,0.22); opacity:1; }
  .sos-contact-icon  { font-size:14px; flex-shrink:0; }
  .sos-contact-info  { flex:1; min-width:0; }
  .sos-contact-name  { display:block; color:#fff; font-size:11px; font-weight:600; }
  .sos-contact-phone { display:block; color:rgba(252,165,165,0.5); font-size:9px; }
  .sos-contact-status{ font-size:9px; font-weight:700; color:#fca5a5; background:rgba(239,68,68,0.2); padding:2px 7px; border-radius:100px; flex-shrink:0; }

  .sos-status {
    margin: 12px 20px 16px;
    border-radius: 12px;
    padding: 10px 14px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    background: rgba(239,68,68,0.14);
    border: 1px solid rgba(239,68,68,0.25);
    color: #fca5a5;
    transition: all 0.7s ease;
  }
  .sos-status--ok {
    background: rgba(5,150,105,0.14);
    border-color: rgba(5,150,105,0.25);
    color: #86efac;
  }

  /* FOOTER — flex-shrink:0 ensures it never gets squished */
  .sos-footer {
    flex-shrink: 0;
    padding: 14px 20px 18px;
    border-top: 1px solid rgba(239,68,68,0.22);
    background: rgba(8,0,0,0.88);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .sos-btn-stop {
    display: block;
    width: 100%;
    padding: 13px 0;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.06));
    border: 1px solid rgba(255,255,255,0.18);
    cursor: pointer;
    margin-bottom: 8px;
    transition: all 0.2s ease;
    letter-spacing: 0.01em;
  }
  .sos-btn-stop:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
  }
  .sos-btn-stop:disabled { opacity:0.4; cursor:not-allowed; }

  .sos-btn-mute {
    display: block;
    width: 100%;
    padding: 10px 0;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.6);
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.09);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .sos-btn-mute:hover:not(:disabled) { background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.85); }
  .sos-btn-mute:disabled { opacity:0.3; cursor:not-allowed; }

  .sos-footer-hint {
    text-align: center;
    color: rgba(252,165,165,0.28);
    font-size: 9px;
    margin-top: 8px;
  }

  /* CONFIRMATION */
  .sos-confirm-overlay {
    position: absolute;
    inset: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(0,0,0,0.9);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-radius: 24px;
  }
  .sos-confirm-card {
    width: 100%;
    max-width: 340px;
    border-radius: 22px;
    padding: 28px 22px;
    text-align: center;
    background: linear-gradient(135deg,#1a0a0a,#0f0505);
    border: 1px solid rgba(239,68,68,0.3);
    box-shadow: 0 24px 60px rgba(239,68,68,0.25);
  }
  .sos-confirm-icon  { font-size:34px; margin-bottom:12px; }
  .sos-confirm-title { color:#fff; font-weight:900; font-size:17px; margin-bottom:8px; }
  .sos-confirm-body  { color:rgba(255,255,255,0.5); font-size:13px; line-height:1.65; margin-bottom:20px; }
  .sos-confirm-safe {
    display: block;
    width: 100%;
    padding: 13px 0;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg,rgba(255,255,255,0.13),rgba(255,255,255,0.06));
    border: 1px solid rgba(255,255,255,0.16);
    cursor: pointer;
    margin-bottom: 10px;
    transition: all 0.2s ease;
  }
  .sos-confirm-safe:hover { background:linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.1)); }
  .sos-confirm-continue {
    display: block;
    width: 100%;
    padding: 13px 0;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    background: #dc2626;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .sos-confirm-continue:hover { background:#b91c1c; }

  /* RESOLVED */
  .sos-resolved-card {
    width: 100%;
    max-width: 340px;
    border-radius: 24px;
    padding: 40px 28px;
    text-align: center;
    background: linear-gradient(135deg,#021a0e,#030f07);
    border: 1px solid rgba(5,150,105,0.4);
    box-shadow: 0 32px 80px rgba(5,150,105,0.3);
  }
  .sos-check {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #16a34a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin: 0 auto 16px;
    box-shadow: 0 0 30px rgba(5,150,105,0.6);
  }
  .sos-resolved-title { color:#fff; font-weight:900; font-size:20px; margin-bottom:8px; }
  .sos-resolved-sub   { color:rgba(134,239,172,0.7); font-size:14px; line-height:1.6; }
  .sos-resolved-hint  { color:rgba(134,239,172,0.35); font-size:11px; margin-top:14px; }

  /* KEYFRAMES */
  @keyframes sosPulseOverlay { from{opacity:.4} to{opacity:1} }
  @keyframes sosPing {
    75%,100% { transform:scale(2); opacity:0; }
  }
  @keyframes sosDotPulse {
    0%,100% { opacity:1; } 50% { opacity:.45; }
  }
`;
