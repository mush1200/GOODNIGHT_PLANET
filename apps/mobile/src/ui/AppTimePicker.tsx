import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';

type Props = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  testID: string;
};

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

export function AppTimePicker({ label, value, onChange, testID }: Props) {
  const [hour = '23', minute = '00'] = value.split(':');

  const pickHour = (nextHour: string) => onChange(`${nextHour}:${minute}`);
  const pickMinute = (nextMinute: string) => onChange(`${hour}:${nextMinute}`);

  return (
    <View style={styles.field} testID={testID}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          {HOURS.filter((h) => Number(h) % 3 === Number(hour) % 3).slice(0, 4).map((h) => (
            <Pressable
              key={h}
              testID={`${testID}-hour-${h}`}
              onPress={() => pickHour(h)}
              style={[styles.chip, h === hour ? styles.chipActive : null]}
            >
              <Text style={styles.chipText}>{h}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.column}>
          {MINUTES.map((m) => (
            <Pressable
              key={m}
              testID={`${testID}-minute-${m}`}
              onPress={() => pickMinute(m)}
              style={[styles.chip, m === minute ? styles.chipActive : null]}
            >
              <Text style={styles.chipText}>{m}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <Text style={styles.value} testID={`${testID}-value`}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.xs },
  label: { ...typography.caption, color: colors.textMuted },
  row: { flexDirection: 'row', gap: spacing.sm },
  column: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 },
  chip: {
    borderWidth: 1,
    borderColor: colors.surfaceCardBorder,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  chipActive: { borderColor: colors.accentSoft, backgroundColor: 'rgba(196,181,253,0.12)' },
  chipText: { color: colors.textPrimary, fontSize: 13 },
  value: { ...typography.caption, color: colors.accentWarm },
});
