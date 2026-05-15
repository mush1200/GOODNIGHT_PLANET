import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { TodayResponse } from './api/client';

import { formatLogicalDateForDisplay } from './timezone';

import { lightStatsLines } from './lightStatsUi';

import { clampWorldTierForUi, worldProgressPercent } from './progressLayout';

import { worldGrowthNarrative } from './progressCopy';

import { RitualStepChecklist } from './RitualStepChecklist';

import { ritualStepStates } from './ritualProgress';

import { ritualGlanceLine, tonightSkyGlanceLine } from './tonightGlanceCopy';
import { trackLaunchMetric } from './launchMetrics';

import { AttunementKit } from './components/AttunementKit';

import { ProgressRing } from './ui/ProgressRing';

import { colors, radius, spacing, typography } from './theme/tokens';

type Props = { today: TodayResponse; defaultExpanded?: boolean };

const TIER_WINDOWS = [1, 2, 3] as const;

export function TonightProgressPanel({ today, defaultExpanded = false }: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const steps = ritualStepStates(today);
  const worldPct = worldProgressPercent(today.worldProgressFraction);
  const tierShown = clampWorldTierForUi(today.worldTier);
  const lightStats = lightStatsLines(today);
  const skyGlance = tonightSkyGlanceLine(today.nightSky);
  const ritualGlance = ritualGlanceLine(today);

  return (
    <View style={styles.wrap} testID="tonight-progress-panel">
      <View testID="tonight-glance" style={styles.glance}>
        <Text testID="tonight-glance-sky" style={styles.glanceLine}>
          {skyGlance}
        </Text>
        <Text testID="tonight-glance-ritual" style={styles.glanceLine}>
          {ritualGlance}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => {
          setExpanded((open) => {
            const next = !open;
            if (next) trackLaunchMetric('home_details_expand');
            return next;
          });
        }}
        style={styles.toggleRow}
        testID="tonight-details-toggle"
      >
        <Text style={styles.sectionLabel}>今晚細節</Text>
        <Text style={styles.toggleHint}>{expanded ? '收起' : '展開'}</Text>
      </Pressable>

      {expanded ? (
        <View testID="tonight-details-body" style={styles.detailsBody}>
          <View style={styles.forecastBlock}>
            <Text style={styles.muted}>今夜 {formatLogicalDateForDisplay(today.logicalSleepDate)}</Text>
            <Text style={styles.body}>{today.forecastSummary}</Text>
            <AttunementKit
              state={today.worldAttunement}
              hint={today.attunementHint}
              rarityTag={today.rarityNarrativeTag}
            />
          </View>

          <Text style={styles.subheading}>儀式</Text>
          <RitualStepChecklist steps={steps} />

          <Text style={styles.subheading}>節奏與世界</Text>
          {lightStats.length > 0 ? (
            <View testID="light-stats-banner" style={styles.lightStats}>
              {lightStats.map((line) => (
                <Text key={line} style={styles.muted}>
                  {line}
                </Text>
              ))}
            </View>
          ) : null}

          <View style={styles.streakBanner} testID="streak-banner">
            <Text style={styles.streakNumber}>{today.streakDays}</Text>
            <Text style={styles.streakUnit}>連勝天</Text>
          </View>

          <View style={styles.tierRow} accessibilityLabel={`世界第 ${tierShown} 階`}>
            {TIER_WINDOWS.map((t) => (
              <View
                key={t}
                style={[styles.tierWindow, t <= tierShown ? styles.tierWindowLit : styles.tierWindowDim]}
                testID={`tier-window-${t}`}
              />
            ))}
          </View>

          <Text style={styles.muted}>
            第 {tierShown} 階 · {worldGrowthNarrative(today.worldProgressFraction)} · 本階約 {worldPct}%
          </Text>
          <ProgressRing percent={worldPct} testID="world-progress-ring" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceCardBorder,
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  glance: {
    gap: spacing.xs,
  },
  glanceLine: {
    ...typography.body,
    color: colors.textPrimary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  toggleHint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  detailsBody: { gap: spacing.sm },
  sectionLabel: {
    ...typography.caption,
    color: colors.accentWarm,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  subheading: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  forecastBlock: { gap: spacing.xs },
  lightStats: { gap: 2 },
  muted: { ...typography.caption, color: colors.textMuted },
  body: { ...typography.body, color: colors.textPrimary },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(196,181,253,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(196,181,253,0.2)',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.accentSoft,
    letterSpacing: 0.5,
  },
  streakUnit: { ...typography.caption, color: colors.textMuted },
  tierRow: { flexDirection: 'row', gap: 6, marginTop: spacing.xs },
  tierWindow: { flex: 1, height: 10, borderRadius: 5 },
  tierWindowLit: {
    backgroundColor: colors.accentWarm,
    opacity: 0.85,
    shadowColor: colors.accentWarm,
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  tierWindowDim: { backgroundColor: 'rgba(255,255,255,0.08)' },
});
