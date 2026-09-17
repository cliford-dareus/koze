/**
 * Pure Web Audio API tranquil sound generator.
 * Creates organic acoustic tones (wooden pebble clicks, singing bowls, soft chimes)
 * without requiring external audio asset files.
 */

class SoundService {
    private ctx: AudioContext | null = null;
    private ambientGain: GainNode | null = null;
    private ambientNodes: AudioNode[] = [];
    private isAmbientPlaying: boolean = false;

    private getContext(): AudioContext | null {
        if (typeof window === 'undefined') return null;
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => { });
        }
        return this.ctx;
    }

    /**
     * Soft wooden pebble or stone tap sound for button and tile selections.
     */
    playPebbleTap(enabled: boolean = true) {
        if (!enabled) return;
        try {
            const ctx = this.getContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(420, now);
            osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.06);
        } catch {
            // AudioContext unavailable or blocked
        }
    }

    /**
     * Serene singing bowl chime for correct matches and answers.
     */
    playGentleChime(enabled: boolean = true) {
        if (!enabled) return;
        try {
            const ctx = this.getContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            const rootFreq = 528; // Solfeggio "transformation" & calm frequency
            const frequencies = [rootFreq, rootFreq * 1.5, rootFreq * 2];

            frequencies.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq + (idx * 1.5), now);

                const initialVol = 0.08 / (idx + 1);
                gain.gain.setValueAtTime(initialVol, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now + idx * 0.02);
                osc.stop(now + 1.3);
            });
        } catch {
            // AudioContext unavailable or blocked
        }
    }

    /**
     * Soft, reflective warm tone for incorrect or retry attempts (never jarring or harsh).
     */
    playReflectionTone(enabled: boolean = true) {
        if (!enabled) return;
        try {
            const ctx = this.getContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(185, now + 0.3);

            gain.gain.setValueAtTime(0.09, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.36);
        } catch {
            // AudioContext unavailable
        }
    }

    /**
     * Ascending tranquil pentatonic harp chord for lesson completion.
     */
    playMilestoneHarp(enabled: boolean = true) {
        if (!enabled) return;
        try {
            const ctx = this.getContext();
            if (!ctx) return;

            const now = ctx.currentTime;
            // Japanese/Eastern calm pentatonic scale: D4, F4, G4, A4, C5, D5
            const notes = [293.66, 349.23, 392.0, 440.0, 523.25, 587.33];

            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.12);

                const start = now + i * 0.12;
                gain.gain.setValueAtTime(0.001, start);
                gain.gain.linearRampToValueAtTime(0.08, start + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.8);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(start);
                osc.stop(start + 2.0);
            });
        } catch {
            // AudioContext unavailable
        }
    }

    /**
     * Toggle tranquil organic pink noise / warm wind ambient sound for deep study focus.
     */
    toggleAmbient(enable: boolean) {
        try {
            const ctx = this.getContext();
            if (!ctx) return;

            if (!enable) {
                if (this.ambientGain) {
                    this.ambientGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.0);
                    setTimeout(() => {
                        this.ambientNodes.forEach(node => {
                            try {
                                if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
                                    (node as AudioScheduledSourceNode).stop();
                                }
                                node.disconnect();
                            } catch { }
                        });
                        this.ambientNodes = [];
                        this.ambientGain = null;
                        this.isAmbientPlaying = false;
                    }, 1100);
                }
                return;
            }

            if (this.isAmbientPlaying) return;

            const bufferSize = ctx.sampleRate * 2;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.03; // quiet
                b6 = white * 0.115926;
            }

            const whiteNoise = ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;

            // Lowpass filter to simulate gentle rustling wind or distant stream
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(320, ctx.currentTime);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 1.5);

            whiteNoise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            whiteNoise.start();

            this.ambientGain = gain;
            this.ambientNodes = [whiteNoise, filter, gain];
            this.isAmbientPlaying = true;
        } catch {
            // AudioContext blocked
        }
    }
}

export const sound = new SoundService();
