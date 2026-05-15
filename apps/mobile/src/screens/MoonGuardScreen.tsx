import { StyleSheet, Text, View } from 'react-native';

import type { MoonGuardStatus, MoonGuardTriggerResponse } from '../api/client';

import { Card } from '../ui/Card';

import { GhostButton } from '../ui/GhostButton';

import { PrimaryButton } from '../ui/PrimaryButton';

import { colors, typography } from '../theme/tokens';



type Props = {

  status: MoonGuardStatus;

  lastTrigger?: MoonGuardTriggerResponse | null;

  onTrigger: () => void;

  onBack: () => void;

};



export function MoonGuardScreen({ status, lastTrigger, onTrigger, onBack }: Props) {

  return (

    <Card testID="moon-guard-screen">

      <View testID="moon-guard-narrative-entry" style={styles.entry}>

        <View testID="moon-guard-phase-glow" style={styles.moon} />

        <Text style={styles.title}>月亮守護</Text>

        <Text style={styles.body}>本週已用 {status.usesThisWeek} 次，不是懲罰，只是幫你留一盞柔光。</Text>

        <Text style={styles.muted}>週次 {status.isoWeek}</Text>

      </View>

      {lastTrigger?.message ? <Text style={styles.quote}>{lastTrigger.message}</Text> : null}
      {lastTrigger?.ok === false && lastTrigger.error === 'on_cooldown' ? (
        <Text testID="moon-guard-cooldown" style={styles.muted}>
          本週的柔光已用過，下週再請月亮幫忙。
        </Text>
      ) : null}

      <PrimaryButton

        testID="moon-guard-trigger"

        title={status.canUse ? '請月亮幫忙' : '本週已用過'}

        disabled={!status.canUse}

        onPress={onTrigger}

      />

      <GhostButton testID="moon-guard-back" title="回到今夜" onPress={onBack} />

    </Card>

  );

}



const styles = StyleSheet.create({

  entry: { gap: 8, alignItems: 'center' },

  moon: {

    width: 72,

    height: 72,

    borderRadius: 36,

    backgroundColor: 'rgba(147,197,253,0.35)',

    marginBottom: 4,

  },

  title: { ...typography.title, color: colors.textPrimary },

  body: { ...typography.body, color: colors.textPrimary, textAlign: 'center' },

  muted: { ...typography.caption, color: colors.textMuted },

  quote: { ...typography.body, color: colors.accentWarm, fontStyle: 'italic', textAlign: 'center' },

});


