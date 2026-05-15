import { useEffect, useMemo, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import type { PetArchetype } from './api/openapiTypes';
import { appPhaseFromSlicePhase, resolveEmotionalPacing } from './emotionalPacing';
import { NightSoundscapePlayer } from './nightSoundscapePlayer';
import {
  resolveNightSoundscapePlayback,
  slicePhaseToAppPhase,
} from './nightSoundscapePlayback';
import { resolveSoundProfile } from './soundProfile';

type Args = {
  slicePhase: string;
  ritualSecondsLeft?: number;
  petArchetype: PetArchetype;
  reduceMotion: boolean;
  soundEnabled: boolean;
  nightSoundEnabled: boolean;
  pushSoundEnabled: boolean;
};

export function useNightSoundscape(args: Args): {
  playUiConfirm: () => void;
} {
  const playerRef = useRef<NightSoundscapePlayer | null>(null);
  if (!playerRef.current) {
    playerRef.current = new NightSoundscapePlayer();
  }

  const playbackPlan = useMemo(() => {
    const appPhase = slicePhaseToAppPhase({
      slicePhase: args.slicePhase,
      ritualSecondsLeft: args.ritualSecondsLeft,
    });
    const pacingPhase = appPhaseFromSlicePhase(args.slicePhase) ?? appPhase ?? 'home';
    const pacing = resolveEmotionalPacing({
      phase: pacingPhase,
      ritualSecondsLeft: args.ritualSecondsLeft,
    });
    const profile = resolveSoundProfile({
      archetype: args.petArchetype,
      pacing,
      reduceMotion: args.reduceMotion,
      soundEnabled: args.soundEnabled,
      nightSoundEnabled: args.nightSoundEnabled,
      pushSoundEnabled: args.pushSoundEnabled,
    });
    const nightSoundsOn = args.soundEnabled && args.nightSoundEnabled;
    return {
      profile,
      plan: resolveNightSoundscapePlayback(
        appPhase,
        profile,
        args.ritualSecondsLeft,
        nightSoundsOn,
      ),
    };
  }, [
    args.nightSoundEnabled,
    args.petArchetype,
    args.pushSoundEnabled,
    args.reduceMotion,
    args.ritualSecondsLeft,
    args.slicePhase,
    args.soundEnabled,
  ]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    void player.apply(playbackPlan.plan);
    return () => {
      player.stop();
    };
  }, [playbackPlan]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        void player.apply(playbackPlan.plan);
        return;
      }
      player.stop();
    };

    const subscription = AppState.addEventListener('change', handleAppState);
    return () => {
      subscription.remove();
    };
  }, [playbackPlan]);

  useEffect(() => {
    return () => {
      playerRef.current?.dispose();
      playerRef.current = null;
    };
  }, []);

  const playUiConfirm = () => {
    const profile = playbackPlan.profile;
    if (!args.soundEnabled || !profile.allowUiClick) return;
    void playerRef.current?.playUiConfirm(profile.uiConfirmAssetKey);
  };

  return { playUiConfirm };
}
