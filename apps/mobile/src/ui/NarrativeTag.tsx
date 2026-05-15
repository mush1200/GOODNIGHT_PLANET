import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';

type Props = {
  label: string;
  tone?: 'default' | 'attunement';
  testID?: string;
};

export function NarrativeTag({ label, tone = 'default', testID }: Props) {
  return (
    <View
      testID={testID ?? 'narrative-tag'}
      style={[styles.tag, tone === 'attunement' ? styles.attunement : styles.default]}
    >
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  default: { backgroundColor: colors.stateAttuneLow },
  attunement: { backgroundColor: 'rgba(196,181,253,0.14)' },
  text: { color: colors.accentWarm, fontSize: 13 },
});
