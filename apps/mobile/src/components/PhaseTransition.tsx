import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, StyleSheet } from 'react-native';

type Props = {
  phaseKey: string;
  children: ReactNode;
  testID?: string;
};

export function PhaseTransition({ phaseKey, children, testID }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    opacity.setValue(0.2);
    Animated.timing(opacity, { toValue: 1, duration: 420, useNativeDriver: true }).start();
  }, [opacity, phaseKey]);

  return (
    <Animated.View testID={testID ?? 'phase-transition'} style={[styles.wrap, { opacity }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
});
