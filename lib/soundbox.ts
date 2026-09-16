/**
 * Merchant Soundbox Audio Simulator
 * Plays audio confirmations using Web Speech Synthesis & Web Audio API oscillator beeps
 */
export function playSoundboxConfirmation(amount: number, merchantName: string = 'Merchant', volume: number = 1.0): Promise<void> {
  return new Promise((resolve) => {
    try {
      // 1. Play chime sound using Web Audio API
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880.0, ctx.currentTime + 0.15); // A5

        gain.gain.setValueAtTime(Math.min(1.0, volume * 0.4), ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }

      // 2. Play speech synthesis after chime
      setTimeout(() => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();

          const formattedAmt = amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);
          const text = `Payment of ${formattedAmt} Rupees received successfully on Split U P I.`;

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.0;
          utterance.pitch = 1.1;
          utterance.volume = Math.max(0, Math.min(1.0, volume));
          utterance.lang = 'en-IN';

          utterance.onend = () => resolve();
          utterance.onerror = () => resolve();

          window.speechSynthesis.speak(utterance);
        } else {
          resolve();
        }
      }, 300);
    } catch (_) {
      resolve();
    }
  });
}
