import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme/tokens';

type Props = {
  secondsLeft: number;
  hint: string;
  testID?: string;
};

export function RitualTimer({ secondsLeft, hint, testID }: Props) {
  const seconds = Math.ceil(secondsLeft);
  return (
    <View
      testID={testID ?? 'ritual-timer'}
      style={styles.wrap}
      accessibilityLabel={`晚安儀式倒數 ${seconds} 秒`}
    >
      <Text
        style={styles.timer}
        accessibilityRole="timer"
        maxFontSizeMultiplier={1.35}
      >
        {String(seconds).padStart(2, '0')}
      </Text>
      {hint ? (
        <Text style={styles.hint} maxFontSizeMultiplier={1.3}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 6 },
  timer: { ...typography.timer, color: colors.accentSoft, textAlign: 'center' },
  hint: { ...typography.caption, color: colors.textMuted },
});
