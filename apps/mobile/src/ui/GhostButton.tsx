import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../theme/tokens';

type Props = {
  title: string;
  onPress: () => void;
  testID?: string;
};

export function GhostButton({ title, onPress, testID }: Props) {
  return (
    <Pressable testID={testID} onPress={onPress} style={styles.ghost}>
      <Text style={styles.ghostText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ghost: { paddingVertical: spacing.sm, alignItems: 'center' },
  ghostText: { color: colors.textMuted, fontSize: 14 },
});
