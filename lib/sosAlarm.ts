/**
 * SOS Emergency Alarm — Web Audio API
 * Generates a realistic emergency siren programmatically.
 * No external audio files required.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let oscillators: OscillatorNode[] = [];
let lfoNode: OscillatorNode | null = null;
let lfoGain: GainNode | null = null;
let isPlaying = false;

function getCtx(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function startSosAlarm(volume = 0.85): void {
  if (isPlaying) return;
  isPlaying = true;

  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();

  masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.15);
  masterGain.connect(ctx.destination);

  // LFO for siren sweep effect
  lfoNode = ctx.createOscillator();
  lfoGain = ctx.createGain();
  lfoNode.type = 'sine';
  lfoNode.frequency.value = 0.9; // sweep rate
  lfoGain.gain.value = 180;      // sweep depth in Hz
  lfoNode.connect(lfoGain);

  // Primary siren tone
  const osc1 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.value = 880;
  lfoGain.connect(osc1.frequency);

  // Harmonic layer
  const osc2 = ctx.createOscillator();
  osc2.type = 'square';
  osc2.frequency.value = 660;
  lfoGain.connect(osc2.frequency);

  // Blend gain
  const blend1 = ctx.createGain();
  blend1.gain.value = 0.55;
  const blend2 = ctx.createGain();
  blend2.gain.value = 0.25;

  // Distortion for urgency
  const waveshaper = ctx.createWaveShaper();
  waveshaper.curve = makeDistortionCurve(60);
  waveshaper.oversample = '4x';

  osc1.connect(blend1);
  osc2.connect(blend2);
  blend1.connect(waveshaper);
  blend2.connect(waveshaper);
  waveshaper.connect(masterGain);

  // Pulse amplitude modulation (beep pattern)
  const pulseOsc = ctx.createOscillator();
  pulseOsc.type = 'square';
  pulseOsc.frequency.value = 3.5; // 3.5 pulses/sec
  const pulseGain = ctx.createGain();
  pulseGain.gain.value = 0.3;
  pulseOsc.connect(pulseGain);
  pulseGain.connect(masterGain.gain);

  lfoNode.start();
  osc1.start();
  osc2.start();
  pulseOsc.start();

  oscillators = [osc1, osc2, pulseOsc];
  lfoNode.start();
}

export function stopSosAlarm(): void {
  if (!isPlaying || !audioCtx || !masterGain) return;

  const ctx = audioCtx;
  const gain = masterGain;

  // Smooth fade out
  gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

  setTimeout(() => {
    oscillators.forEach(o => { try { o.stop(); o.disconnect(); } catch {} });
    lfoNode?.stop(); lfoNode?.disconnect();
    lfoGain?.disconnect();
    gain.disconnect();
    oscillators = [];
    lfoNode = null;
    lfoGain = null;
    masterGain = null;
    isPlaying = false;
  }, 350);
}

export function isSosPlaying(): boolean {
  return isPlaying;
}

function makeDistortionCurve(amount: number) {
  const n = 256;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

/** Vibrate device if supported */
export function triggerVibration(): void {
  if ('vibrate' in navigator) {
    navigator.vibrate([300, 100, 300, 100, 500, 200, 300, 100, 300]);
  }
}
