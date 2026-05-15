import type { SoundProfile } from './soundProfile';

export type NightSoundscapeIntent = {
  profile: SoundProfile;
  activeLayers: Array<'ambient_bed' | 'ritual_breath' | 'ui_confirm' | 'reveal' | 'transition'>;
};

export function nightSoundscapeIntent(profile: SoundProfile, phaseLayer: NightSoundscapeIntent['activeLayers'][number] | null): NightSoundscapeIntent {
  const activeLayers: NightSoundscapeIntent['activeLayers'] = [];
  if (profile.ambientBedAssetKey) activeLayers.push('ambient_bed');
  if (phaseLayer) activeLayers.push(phaseLayer);
  return { profile, activeLayers };
}

export function notificationSoundForProfile(profile: SoundProfile): string | null {
  if (!profile.playNotificationSound || profile.notificationSoundKey === 'silent') return null;
  return profile.notificationSoundKey;
}
