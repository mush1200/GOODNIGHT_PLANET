import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

type Props = {
  active?: boolean;
  testID?: string;
};

export function SoftUnboxGlow({ active = true, testID }: Props) {
  const opacity = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    if (!active) {
      opacity.setValue(0.15);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.55, duration: 1800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.22, duration: 1800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, opacity]);

  return (
    <Animated.View
      testID={testID ?? 'soft-unbox-glow'}
      style={[styles.glow, { opacity }]}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    borderRadius: 24,
    backgroundColor: 'rgba(196,181,253,0.16)',
  },
});
