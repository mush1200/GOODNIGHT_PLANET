import AsyncStorage from '@react-native-async-storage/async-storage';

export const SOUND_ENABLED_KEY = 'sound_enabled';
export const NIGHT_SOUND_ENABLED_KEY = 'night_sound_enabled';

export async function readSoundEnabled(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(SOUND_ENABLED_KEY);
  if (raw === null) return true;
  return raw === 'true';
}

export async function writeSoundEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(SOUND_ENABLED_KEY, enabled ? 'true' : 'false');
}

export async function readNightSoundEnabled(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(NIGHT_SOUND_ENABLED_KEY);
  if (raw === null) return true;
  return raw === 'true';
}

export async function writeNightSoundEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(NIGHT_SOUND_ENABLED_KEY, enabled ? 'true' : 'false');
}
