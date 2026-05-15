import { StyleSheet, Text } from 'react-native';
import { DEFAULT_SLEEP_ROLLOVER_HOUR, isBeforeLogicalRollover } from '../sleepRollover';
import { colors, typography } from '../theme/tokens';

export { isBeforeLogicalRollover };

type Props = {
  now?: Date;
  testID?: string;
};

export function LogicalDateHint({ now = new Date(), testID }: Props) {
  if (!isBeforeLogicalRollover(now)) return null;

  return (
    <Text testID={testID ?? 'logical-date-hint'} style={styles.hint}>
      凌晨{DEFAULT_SLEEP_ROLLOVER_HOUR}點前仍算「昨夜」的邏輯日，顯示日期會跟著這個節奏。
    </Text>
  );
}

const styles = StyleSheet.create({
  hint: { ...typography.caption, color: colors.textMuted, marginBottom: 6 },
});
