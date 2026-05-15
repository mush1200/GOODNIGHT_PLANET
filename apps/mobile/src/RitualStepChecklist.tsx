import { StyleSheet, Text, View } from 'react-native';
import type { RitualStep } from './ritualProgress';
import { colors, radius, spacing, typography } from './theme/tokens';

type Props = { steps: RitualStep[] };

export function RitualStepChecklist({ steps }: Props) {
  return (
    <View style={styles.steps} accessibilityLabel="今晚儀式完成度">
      {steps.map((step) => (
        <View
          key={step.id}
          style={[styles.stepRow, step.done && styles.stepRowDone]}
          accessibilityState={{ checked: step.done }}
          testID={`ritual-step-${step.id}`}
        >
          <View style={[styles.stepGlyph, step.done && styles.stepGlyphDone]}>
            <Text style={styles.stepGlyphText}>{step.done ? '✓' : '○'}</Text>
          </View>
          <Text style={[styles.stepLabel, step.done && styles.stepLabelDone]}>{step.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  steps: { gap: spacing.xs },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  stepRowDone: {
    borderColor: 'rgba(134,239,172,0.25)',
    backgroundColor: 'rgba(134,239,172,0.06)',
  },
  stepGlyph: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  stepGlyphDone: {
    backgroundColor: 'rgba(134,239,172,0.15)',
  },
  stepGlyphText: { fontSize: 14, color: colors.textPrimary },
  stepLabel: { ...typography.body, flex: 1, fontSize: 14, color: colors.textMuted },
  stepLabelDone: { color: colors.textPrimary },
});
