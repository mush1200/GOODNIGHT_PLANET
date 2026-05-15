import { StyleSheet, Text, View } from 'react-native';

import type { MemoryEntry } from '../api/client';

import { dreamNameForKey } from '../catalog/dreamCatalog';

import { MemoryIllustration } from '../components/MemoryIllustration';

import { formatLogicalDateForDisplay } from '../timezone';

import { Card } from '../ui/Card';

import { GhostButton } from '../ui/GhostButton';

import { colors, typography } from '../theme/tokens';



type Props = {

  entries: MemoryEntry[];

  onBack: () => void;

};



export function MemoryArchiveScreen({ entries, onBack }: Props) {

  return (

    <Card testID="memory-archive-screen">

      <Text style={styles.title}>記憶冊</Text>

      {entries.length === 0 ? (

        <Text style={styles.muted}>還沒有收進冊子裡的夢，今晚先慢慢來。</Text>

      ) : (

        entries.map((entry) => (

          <View key={entry.id} testID={`memory-entry-${entry.logicalSleepDate}`} style={styles.row}>

            <MemoryIllustration dreamKey={entry.dreamKey} nightSkyKey={entry.nightSkyKey} />

            <Text style={styles.date}>{formatLogicalDateForDisplay(entry.logicalSleepDate)}</Text>

            <Text style={styles.muted}>{formatLogicalDateForDisplay(entry.createdAt.slice(0, 10))}</Text>

            <Text testID={`memory-entry-name-${entry.logicalSleepDate}`} style={styles.dreamName}>

              {dreamNameForKey(entry.dreamKey)}

            </Text>

            <Text style={styles.body}>{entry.narrative}</Text>

          </View>

        ))

      )}

      <GhostButton testID="memory-archive-back" title="回到今夜" onPress={onBack} />

    </Card>

  );

}



const styles = StyleSheet.create({

  title: { ...typography.title, color: colors.textPrimary },

  muted: { ...typography.caption, color: colors.textMuted },

  row: { gap: 4, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },

  date: { ...typography.caption, color: colors.accentWarm },

  dreamName: { ...typography.subtitle, color: colors.accentSoft },

  body: { ...typography.body, color: colors.textPrimary },

});


