import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';

type Props = {
  children: ReactNode;
  testID?: string;
  borderColor?: string;
};

export function Card({ children, testID, borderColor }: Props) {
  return (
    <View
      testID={testID}
      style={[styles.card, borderColor ? { borderColor } : null]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceCardBorder,
    padding: spacing.lg,
    gap: spacing.md,
  },
});
