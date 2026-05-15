import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { useReducedMotion } from '../useReducedMotion';

type Props = {
  active?: boolean;
  testID?: string;
};

export function BreathingGlow({ active = true, testID }: Props) {
  const reducedMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    if (!active || reducedMotion) {
      opacity.setValue(reducedMotion ? 0.42 : 0.2);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.72, duration: 2200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.28, duration: 2200, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, opacity, reducedMotion]);

  return (
    <Animated.View
      testID={testID ?? 'breathing-glow'}
      style={[styles.glow, { opacity }]}
    />
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    height: 120,
    borderRadius: 24,
    backgroundColor: 'rgba(196,181,253,0.18)',
  },
});
