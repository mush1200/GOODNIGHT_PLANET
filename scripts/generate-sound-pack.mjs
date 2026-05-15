import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const listeningDir = path.join(root, '..', 'apps', 'mobile', 'assets', 'sounds', 'listening');
const soundsDir = path.join(root, '..', 'apps', 'mobile', 'assets', 'sounds');

const listeningKeys = [
  'ui_confirm_soft',
  'ritual_breath_soft',
  'reveal_unbox_soft',
  'transition_soft',
  'push_preview_soft',
];

const profileKeys = [
  'ui_confirm_gentle',
  'ui_confirm_sleepy',
  'ui_confirm_shy',
  'ui_confirm_night_owl',
  'ritual_breath_gentle',
  'ritual_breath_sleepy',
  'ritual_breath_shy',
  'ritual_breath_night_owl',
  'bed_home_gentle',
  'bed_home_sleepy',
  'bed_home_shy',
  'bed_home_night_owl',
  'reveal_unbox',
  'transition_soft',
  'push_goodnight_whisper',
];

function writeWav(filePath, { sampleRate, samples }) {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }
  writeFileSync(filePath, buffer);
}

function envelope(index, total, attackRatio = 0.08, releaseRatio = 0.35) {
  const attack = Math.floor(total * attackRatio);
  const releaseStart = Math.floor(total * (1 - releaseRatio));
  if (index < attack) return index / Math.max(1, attack);
  if (index >= releaseStart) return (total - index) / Math.max(1, total - releaseStart);
  return 1;
}

function toneSamples({ durationSeconds, sampleRate, frequency, volume }) {
  const total = Math.max(1, Math.floor(sampleRate * durationSeconds));
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i += 1) {
    const t = i / sampleRate;
    const env = envelope(i, total);
    samples[i] = Math.sin(2 * Math.PI * frequency * t) * volume * env;
  }
  return samples;
}

function breathSamples({ durationSeconds, sampleRate, frequency, volume, cycles }) {
  const total = Math.max(1, Math.floor(sampleRate * durationSeconds));
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i += 1) {
    const t = i / sampleRate;
    const pulse = 0.55 + 0.45 * Math.sin((2 * Math.PI * t) / (durationSeconds / cycles));
    const env = envelope(i, total, 0.12, 0.2);
    samples[i] = Math.sin(2 * Math.PI * frequency * t) * volume * pulse * env;
  }
  return samples;
}

function airSamples({ durationSeconds, sampleRate, frequency, volume }) {
  const total = Math.max(1, Math.floor(sampleRate * durationSeconds));
  const samples = new Float32Array(total);
  for (let i = 0; i < total; i += 1) {
    const t = i / sampleRate;
    const env = envelope(i, total, 0.2, 0.35);
    const drift = Math.sin(2 * Math.PI * 0.18 * t) * 0.04;
    samples[i] = Math.sin(2 * Math.PI * frequency * (1 + drift) * t) * volume * env;
  }
  return samples;
}

function samplesForListeningKey(key) {
  const sampleRate = 16000;
  switch (key) {
    case 'ui_confirm_soft':
      return toneSamples({ sampleRate, durationSeconds: 0.07, frequency: 280, volume: 0.08 });
    case 'ritual_breath_soft':
      return breathSamples({
        sampleRate,
        durationSeconds: 2.2,
        frequency: 92,
        volume: 0.06,
        cycles: 1,
      });
    case 'reveal_unbox_soft':
      return toneSamples({ sampleRate, durationSeconds: 0.28, frequency: 210, volume: 0.07 });
    case 'transition_soft':
      return toneSamples({ sampleRate, durationSeconds: 0.16, frequency: 170, volume: 0.05 });
    case 'push_preview_soft':
      return airSamples({ sampleRate, durationSeconds: 0.1, frequency: 240, volume: 0.04 });
    default:
      throw new Error(`unknown_listening_key:${key}`);
  }
}

mkdirSync(listeningDir, { recursive: true });
for (const key of listeningKeys) {
  const samples = samplesForListeningKey(key);
  writeWav(path.join(listeningDir, `${key}.wav`), { sampleRate: 16000, samples });
}

writeFileSync(
  path.join(soundsDir, 'manifest.json'),
  JSON.stringify(
    {
      listening: listeningKeys,
      keys: profileKeys,
      format: 'wav',
      version: 3,
      tier: 'listening',
    },
    null,
    2,
  ),
);

console.log(`Wrote ${listeningKeys.length} listening WAV files to ${listeningDir}`);
