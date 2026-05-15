import { StyleSheet, Text } from 'react-native';
import { Card } from '../ui/Card';
import { GhostButton } from '../ui/GhostButton';
import { PrimaryButton } from '../ui/PrimaryButton';
import { colors, typography } from '../theme/tokens';

type Props = {
  onConfirm: () => void;
  onSkip: () => void;
  onCancel: () => void;
  completed?: boolean;
  message?: string | null;
};

export function DayClosureScreen({ onConfirm, onSkip, onCancel, completed = false, message }: Props) {
  if (completed) {
    return (
      <Card testID="day-closure-complete">
        <Text style={styles.title}>今天先收工</Text>
        <Text style={styles.body}>{message ?? '今天的步調先到這裡，晚安流仍會在你要的時候等你。'}</Text>
        <GhostButton testID="day-closure-done-back" title="回到今夜" onPress={onCancel} />
      </Card>
    );
  }

  return (
    <Card testID="day-closure-confirm">
      <Text style={styles.title}>今天先收工</Text>
      <Text style={styles.body}>不會自動入睡，只是幫你把今天的節奏輕輕合上。</Text>
      <PrimaryButton testID="day-closure-confirm-action" title="確認收工" onPress={onConfirm} />
      <GhostButton testID="day-closure-skip" title="今天先略過" onPress={onSkip} />
      <GhostButton testID="day-closure-cancel" title="先不用" onPress={onCancel} />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.textPrimary },
  body: { ...typography.body, color: colors.textPrimary },
});
