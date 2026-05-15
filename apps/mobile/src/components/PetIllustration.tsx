import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import type { WorldAttunement } from '../api/openapiTypes';
import type { PetMicroPerformance } from '../derivePetMicroPerformance';

import { attunementVisual } from '../theme/attunementTheme';

import { nightSkyThemeForKey } from '../theme/nightSkyTheme';

import { colors, radius } from '../theme/tokens';



type Props = {

  archetype?: string;

  attunement?: WorldAttunement;

  nightSkyKey?: string;

  microPerformance?: PetMicroPerformance;

  testID?: string;

};



export function PetIllustration({

  archetype = 'gentle',

  attunement,

  nightSkyKey,

  microPerformance,

  testID,

}: Props) {

  const visual = attunementVisual(attunement);

  const palette = paletteFor(archetype, nightSkyKey);

  const skyOverlay = nightSkyThemeForKey(nightSkyKey ?? 'clear_star').petOverlay;

  const motion = useRef(new Animated.Value(0)).current;

  const pose = microPerformance?.pose ?? 'holding_pillow';

  const overlay = microPerformance?.overlay ?? 'none';

  const animationPreset = microPerformance?.animationPreset ?? 'tiny_rotation';



  useEffect(() => {

    const duration = animationPreset === 'breathing' ? 2400 : 3200;

    const loop = Animated.loop(

      Animated.sequence([

        Animated.timing(motion, { toValue: 1, duration, useNativeDriver: true }),

        Animated.timing(motion, { toValue: 0, duration, useNativeDriver: true }),

      ]),

    );

    loop.start();

    return () => loop.stop();

  }, [animationPreset, motion]);



  const translateY = motion.interpolate({

    inputRange: [0, 1],

    outputRange: animationPreset === 'slow_float' ? [0, -6] : [0, -3],

  });

  const scale = motion.interpolate({

    inputRange: [0, 1],

    outputRange: animationPreset === 'breathing' ? [1, 1.03] : [1, 1.01],

  });

  const rotate = motion.interpolate({

    inputRange: [0, 1],

    outputRange:

      animationPreset === 'tiny_rotation'

        ? ['-1.5deg', '1.5deg']

        : pose === 'dozing'

          ? ['-2deg', '0deg']

          : ['0deg', '0deg'],

  });



  return (

    <Animated.View

      testID={testID ?? 'pet-illustration'}

      style={[

        styles.wrap,

        poseStyles(pose),

        {

          opacity: visual.saturation,

          transform: [{ translateY }, { scale }, { rotate }],

        },

      ]}

    >

      <View style={[styles.body, palette.body]} />

      <View style={[styles.glow, palette.glow, { backgroundColor: visual.accent }]} />

      <View style={[styles.eyeLeft, pose === 'dozing' ? styles.eyeDozing : null]} />

      <View style={[styles.eyeRight, pose === 'dozing' ? styles.eyeDozing : null]} />

      <View testID="pet-illustration-ear-left" style={[styles.earLeft, palette.body]} />

      <View testID="pet-illustration-ear-right" style={[styles.earRight, palette.body]} />

      {overlay === 'pillow' ? (
        <View
          testID="pet-overlay-pillow"
          style={[styles.overlayPillow, { backgroundColor: skyOverlay.pillow }]}
        />
      ) : null}

      {overlay === 'window_glow' ? (
        <View
          testID="pet-overlay-window"
          style={[
            styles.overlayWindow,
            { backgroundColor: skyOverlay.window, borderColor: skyOverlay.windowBorder },
          ]}
        />
      ) : null}

      {overlay === 'lamp_warm' ? (
        <View
          testID="pet-overlay-lamp"
          style={[styles.overlayLamp, { backgroundColor: skyOverlay.lamp }]}
        />
      ) : null}

      {overlay === 'dim_veil' ? (
        <View
          testID="pet-overlay-dim"
          style={[styles.overlayDim, { backgroundColor: skyOverlay.dim }]}
        />
      ) : null}

    </Animated.View>

  );

}



function poseStyles(pose: PetMicroPerformance['pose']) {

  switch (pose) {

    case 'by_window':

      return { marginRight: 18 };

    case 'kept_lamp':

      return { marginBottom: 4 };

    case 'dim_breath':

      return { opacity: 0.88 };

    default:

      return null;

  }

}



function paletteFor(archetype: string, nightSkyKey?: string) {

  const skyTint =

    nightSkyKey === 'blue_moon'

      ? { body: { backgroundColor: '#5f6b8f' }, glow: { backgroundColor: 'rgba(147,197,253,0.22)' } }

      : nightSkyKey === 'soft_rain'

        ? { body: { backgroundColor: '#566274' }, glow: { backgroundColor: 'rgba(148,163,184,0.2)' } }

        : null;



  if (skyTint) return skyTint;



  switch (archetype) {

    case 'sleepy':

      return { body: { backgroundColor: '#6b5f8f' }, glow: { backgroundColor: 'rgba(196,181,253,0.25)' } };

    case 'shy':

      return { body: { backgroundColor: '#5f6b8f' }, glow: { backgroundColor: 'rgba(147,197,253,0.2)' } };

    case 'night_owl':

      return { body: { backgroundColor: '#4f5d7a' }, glow: { backgroundColor: 'rgba(252,211,138,0.18)' } };

    default:

      return { body: { backgroundColor: '#7c6b9b' }, glow: { backgroundColor: 'rgba(196,181,253,0.22)' } };

  }

}



const styles = StyleSheet.create({

  wrap: {

    width: 120,

    height: 96,

    alignSelf: 'center',

    justifyContent: 'center',

    alignItems: 'center',

  },

  body: {

    width: 88,

    height: 72,

    borderRadius: radius.lg,

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.12)',

  },

  glow: {

    position: 'absolute',

    width: 104,

    height: 80,

    borderRadius: radius.lg,

    zIndex: -1,

    opacity: 0.35,

  },

  earLeft: {

    position: 'absolute',

    top: 8,

    left: 28,

    width: 18,

    height: 22,

    borderRadius: 8,

    opacity: 0.9,

  },

  earRight: {

    position: 'absolute',

    top: 8,

    right: 28,

    width: 18,

    height: 22,

    borderRadius: 8,

    opacity: 0.9,

  },

  eyeLeft: {

    position: 'absolute',

    top: 34,

    left: 42,

    width: 8,

    height: 8,

    borderRadius: 4,

    backgroundColor: colors.textPrimary,

    opacity: 0.85,

  },

  eyeRight: {

    position: 'absolute',

    top: 34,

    right: 42,

    width: 8,

    height: 8,

    borderRadius: 4,

    backgroundColor: colors.textPrimary,

    opacity: 0.85,

  },

  eyeDozing: {

    height: 4,

    borderRadius: 2,

    opacity: 0.55,

  },

  overlayPillow: {

    position: 'absolute',

    bottom: 6,

    width: 54,

    height: 20,

    borderRadius: 10,

  },

  overlayWindow: {

    position: 'absolute',

    right: -8,

    top: 10,

    width: 28,

    height: 48,

    borderRadius: 8,

    borderWidth: 1,

  },

  overlayLamp: {

    position: 'absolute',

    bottom: -4,

    width: 72,

    height: 18,

    borderRadius: 9,

  },

  overlayDim: {

    ...StyleSheet.absoluteFillObject,

    borderRadius: radius.lg,

  },

});

