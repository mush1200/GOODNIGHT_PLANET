import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';

import { soundPackModuleForKey } from './assets/soundPack';
import type { NightSoundscapePlaybackPlan } from './nightSoundscapePlayback';

let audioModeReady = false;

async function ensureAudioMode(): Promise<void> {
  if (audioModeReady) return;
  await setAudioModeAsync({
    playsInSilentMode: true,
    shouldPlayInBackground: false,
    interruptionMode: 'mixWithOthers',
  });
  audioModeReady = true;
}

export class NightSoundscapePlayer {
  private loopPlayer: AudioPlayer | null = null;
  private oneShotPlayer: AudioPlayer | null = null;
  private activeLoopKey: string | null = null;
  private lastOneShotKey: string | null = null;

  async apply(plan: NightSoundscapePlaybackPlan): Promise<void> {
    if (plan.silent) {
      this.stop();
      return;
    }

    if (plan.oneShotAssetKey) {
      await this.playOneShot(plan.oneShotAssetKey, plan.oneShotVolume);
    }

    if (!plan.loopAssetKey) {
      this.stopLoop();
      return;
    }

    if (this.activeLoopKey === plan.loopAssetKey && this.loopPlayer) {
      this.loopPlayer.volume = plan.loopVolume;
      if (!this.loopPlayer.playing) {
        this.loopPlayer.play();
      }
      return;
    }

    await ensureAudioMode();
    const source = soundPackModuleForKey(plan.loopAssetKey);
    if (!this.loopPlayer) {
      this.loopPlayer = createAudioPlayer(source);
      this.loopPlayer.loop = true;
    } else {
      this.loopPlayer.replace(source);
      this.loopPlayer.loop = true;
    }
    this.loopPlayer.volume = plan.loopVolume;
    this.activeLoopKey = plan.loopAssetKey;
    this.loopPlayer.play();
  }

  async playUiConfirm(assetKey: string, volume = 0.12): Promise<void> {
    await this.playOneShot(assetKey, volume);
  }

  stop(): void {
    this.stopLoop();
    this.stopOneShot();
  }

  dispose(): void {
    this.stop();
    this.loopPlayer?.remove();
    this.oneShotPlayer?.remove();
    this.loopPlayer = null;
    this.oneShotPlayer = null;
    this.activeLoopKey = null;
    this.lastOneShotKey = null;
  }

  private stopLoop(): void {
    if (!this.loopPlayer) {
      this.activeLoopKey = null;
      return;
    }
    this.loopPlayer.pause();
    this.activeLoopKey = null;
  }

  private stopOneShot(): void {
    if (!this.oneShotPlayer) {
      this.lastOneShotKey = null;
      return;
    }
    this.oneShotPlayer.pause();
    this.lastOneShotKey = null;
  }

  private async playOneShot(assetKey: string, volume: number): Promise<void> {
    if (this.lastOneShotKey === assetKey && this.oneShotPlayer?.playing) {
      return;
    }

    await ensureAudioMode();
    const source = soundPackModuleForKey(assetKey);
    if (!this.oneShotPlayer) {
      this.oneShotPlayer = createAudioPlayer(source);
    } else {
      this.oneShotPlayer.replace(source);
    }
    this.oneShotPlayer.loop = false;
    this.oneShotPlayer.volume = volume;
    this.lastOneShotKey = assetKey;
    this.oneShotPlayer.play();
  }
}
