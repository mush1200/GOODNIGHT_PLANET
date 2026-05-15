import { StyleSheet, Text, View } from 'react-native';
import type { WorldAttunement } from '../api/openapiTypes';
import { attunementVisual } from '../theme/attunementTheme';
import { colors, typography } from '../theme/tokens';
import { NarrativeTag } from '../ui/NarrativeTag';

type Props = {
  state?: WorldAttunement;
  hint?: string | null;
  rarityTag?: string;
  testID?: string;
};

export function AttunementKit({ state, hint, rarityTag, testID }: Props) {
  const visual = attunementVisual(state);
  return (
    <View testID={testID ?? 'attunement-kit'} style={styles.wrap}>
      {hint ? <Text style={[styles.hint, { color: visual.accent }]}>{hint}</Text> : null}
      {rarityTag ? <NarrativeTag label={rarityTag} tone="attunement" testID="attunement-rarity-tag" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  hint: { ...typography.body, color: colors.textPrimary, fontStyle: 'italic' },
});
