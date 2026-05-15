import { StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';

type Props = {
  pendingCount: number;
  syncing?: boolean;
  testID?: string;
};

export function SyncStatusBar({ pendingCount, syncing = false, testID }: Props) {
  if (pendingCount <= 0 && !syncing) return null;

  const copy = syncing
    ? '同步中…小屋會替你留著這一步。'
    : `已暫存 ${pendingCount} 步，連線後會慢慢補上。`;

  return (
    <Text testID={testID ?? 'sync-status-bar'} style={styles.bar}>
      {copy}
    </Text>
  );
}

const styles = StyleSheet.create({
  bar: {
    ...typography.caption,
    color: colors.accentWarm,
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 10,
    backgroundColor: 'rgba(252,211,138,0.08)',
  },
});
