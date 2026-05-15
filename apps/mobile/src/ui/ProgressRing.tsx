import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme/tokens';

type Props = {
  percent: number;
  label?: string;
  testID?: string;
};

export function ProgressRing({ percent, label, testID }: Props) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <View testID={testID ?? 'progress-ring'} style={styles.wrap} accessibilityLabel={label}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped}%` }]} />
      </View>
      <Text style={styles.caption}>{clamped}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: colors.accentSoft,
  },
  caption: { ...typography.caption, color: colors.textMuted },
});
