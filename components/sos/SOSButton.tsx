'use client';
import { useState, useRef, useCallback } from 'react';
import SOSModal from './SOSModal';
import { startSosAlarm, triggerVibration } from '@/lib/sosAlarm';

interface SOSButtonProps {
  userName?: string;
  busId?: string;
  location?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SOSButton({ userName, busId, location, size = 'lg' }: SOSButtonProps) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStart = useRef<number>(0);
  const HOLD_DURATION = 3000; // 3 seconds

  const sizeMap = {
    sm: 'w-20 h-20 text-base',
    md: 'w-28 h-28 text-lg',
    lg: 'w-36 h-36 text-xl',
  };

  const startHold = useCallback(() => {
    if (triggered) return;
    setHolding(true);
    holdStart.current = Date.now();

    holdTimer.current = setInterval(() => {
      const elapsed = Date.now() - holdStart.current;
      const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setProgress(pct);

      if (elapsed >= HOLD_DURATION) {
        clearInterval(holdTimer.current!);
        setHolding(false);
        setProgress(0);
        setTriggered(true);
        setShowModal(true);
        startSosAlarm(0.8);
        triggerVibration();
      }
    }, 50);
  }, [triggered]);

  const cancelHold = useCallback(() => {
    if (holdTimer.current) clearInterval(holdTimer.current);
    setHolding(false);
    setProgress(0);
  }, []);

  const handleDismiss = useCallback(() => {
    setShowModal(false);
    setTriggered(false);
    setProgress(0);
  }, []);

  const circumference = 2 * Math.PI * 52; // r=52

  return (
    <>
      <div className="relative inline-flex items-center justify-center">
        {/* Outer pulse rings when triggered */}
        {triggered && (
          <>
            <div className="absolute w-48 h-48 rounded-full border-2 border-red-500/30 animate-ping" />
            <div className="absolute w-40 h-40 rounded-full border-2 border-red-500/40 animate-ping" style={{animationDelay:'0.3s'}} />
          </>
        )}

        {/* Progress ring SVG */}
        <svg className="absolute" width="148" height="148" viewBox="0 0 148 148" style={{transform:'rotate(-90deg)'}}>
          {/* Track */}
          <circle cx="74" cy="74" r="52" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="4" />
          {/* Progress */}
          <circle
            cx="74" cy="74" r="52"
            fill="none"
            stroke={holding ? '#ef4444' : 'transparent'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * progress) / 100}
            style={{transition: 'stroke-dashoffset 0.05s linear'}}
          />
        </svg>

        {/* Main button */}
        <button
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={(e) => { e.preventDefault(); startHold(); }}
          onTouchEnd={cancelHold}
          className={`relative ${sizeMap[size]} rounded-full font-black text-white select-none transition-all duration-200 ${
            triggered
              ? 'bg-red-600 shadow-[0_0_40px_rgba(239,68,68,0.8)] scale-95'
              : holding
              ? 'bg-red-600 scale-95 shadow-[0_0_30px_rgba(239,68,68,0.6)]'
              : 'bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]'
          }`}
          style={{
            animation: triggered ? 'sosBtnPulse 0.8s ease-in-out infinite' : undefined,
          }}
        >
          <span className="block leading-none">SOS</span>
          {holding && (
            <span className="block text-[10px] font-normal mt-1 opacity-80">
              {Math.ceil((HOLD_DURATION - (progress / 100) * HOLD_DURATION) / 1000)}s
            </span>
          )}
        </button>
      </div>

      {showModal && (
        <SOSModal
          onDismiss={handleDismiss}
          userName={userName}
          busId={busId}
          location={location}
        />
      )}

      <style>{`
        @keyframes sosBtnPulse {
          0%,100% { box-shadow: 0 0 20px rgba(239,68,68,0.6); }
          50%      { box-shadow: 0 0 50px rgba(239,68,68,0.9), 0 0 80px rgba(239,68,68,0.4); }
        }
      `}</style>
    </>
  );
}
