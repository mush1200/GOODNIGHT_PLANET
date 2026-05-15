import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { NightSkyBackdrop } from '../components/NightSkyBackdrop';
import type { WorldAttunement } from '../api/openapiTypes';
import { attunementVisual } from '../theme/attunementTheme';
import { cottageWarmthForKey } from '../theme/cottageWarmth';

type Props = {
  children: ReactNode;
  nightSkyKey?: string;
  worldAttunement?: WorldAttunement;
  cottageWarmth?: boolean;
  testID?: string;
};

export function ScreenShell({ children, nightSkyKey, worldAttunement, cottageWarmth, testID }: Props) {
  const visual = attunementVisual(worldAttunement);
  const warmth = cottageWarmth ? cottageWarmthForKey(nightSkyKey) : null;
  return (
    <View testID={testID} style={[styles.shell, { backgroundColor: visual.background }]}>
      <NightSkyBackdrop nightSkyKey={nightSkyKey} glowColor={visual.accent} />
      {warmth ? (
        <View
          testID="screen-shell-cottage-warmth"
          style={[styles.cottageWarmth, { backgroundColor: warmth.shellWash }]}
          pointerEvents="none"
        />
      ) : null}
      <View style={[styles.content, { opacity: visual.saturation }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
  content: { flex: 1 },
  cottageWarmth: {
    ...StyleSheet.absoluteFillObject,
  },
});
