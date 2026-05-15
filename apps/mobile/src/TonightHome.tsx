import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import type { TodayResponse } from './api/client';
import { goodnightLineVisualVariant } from './contentVisual';
import { derivePetMicroPerformance } from './derivePetMicroPerformance';
import { pickContextualLine } from './pickContextualLine';
import { trackLaunchMetric } from './launchMetrics';
import { cottageWarmthForKey } from './theme/cottageWarmth';
import { colors, spacing, typography } from './theme/tokens';
import { useReducedMotion } from './useReducedMotion';
import { Card } from './ui/Card';
import { GhostButton } from './ui/GhostButton';
import { PrimaryButton } from './ui/PrimaryButton';
import { TonightProgressPanel } from './TonightProgressPanel';
import { PetIllustration } from './components/PetIllustration';

type Props = {
  today: TodayResponse;
  onStartRitual: () => void;
  onWakeAndUnbox: () => void;
  onDayClosure: () => void;
  onOpenMemory: () => void;
  onOpenSettings: () => void;
  onOpenMoonGuard: () => void;
};

export function TonightHome({
  today,
  onStartRitual,
  onWakeAndUnbox,
  onDayClosure,
  onOpenMemory,
  onOpenSettings,
  onOpenMoonGuard,
}: Props) {
  const contextual = pickContextualLine(today);
  const microPerformance = derivePetMicroPerformance(today);
  const cottageWarmth = cottageWarmthForKey(today.nightSky.key);
  const lineVariant = goodnightLineVisualVariant(contextual.line);
  const reducedMotion = useReducedMotion();
  const heroLift = useRef(new Animated.Value(0)).current;
  const [secondaryOpen, setSecondaryOpen] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      heroLift.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(heroLift, { toValue: -4, duration: 3600, useNativeDriver: true }),
        Animated.timing(heroLift, { toValue: 0, duration: 3600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [heroLift, reducedMotion]);

  return (
    <Card testID="TonightHome">
      <View testID="tonight-home-hero" style={styles.hero}>
        <View
          testID="tonight-home-cottage-glow"
          style={[styles.cottageGlow, { backgroundColor: cottageWarmth.heroGlow }]}
          pointerEvents="none"
        />
        <Animated.View style={[styles.petStage, { transform: [{ translateY: heroLift }] }]}>
          <PetIllustration
            archetype={today.petArchetype}
            attunement={today.worldAttunement}
            nightSkyKey={today.nightSky.key}
            microPerformance={microPerformance}
          />
        </Animated.View>
        <Text
          testID={`contextual-line-${contextual.priorityKey}`}
          style={[styles.contextualLine, toneStyle(contextual.tone)]}
        >
          「{contextual.line}」
        </Text>
        <Text testID={`goodnight-line-variant-${lineVariant}`} style={styles.srOnly}>
          {contextual.line}
        </Text>
        {today.unboxed ? null : today.sleeping ? (
          <PrimaryButton
            testID="home-wake-unbox"
            title="睡醒開箱"
            onPress={onWakeAndUnbox}
            accessibilityLabel="睡醒開箱"
          />
        ) : (
          <PrimaryButton
            testID="home-start-ritual"
            title="開始晚安儀式"
            onPress={onStartRitual}
            accessibilityLabel="開始晚安儀式"
          />
        )}
      </View>

      <TonightProgressPanel today={today} />

      <View testID="tonight-home-secondary" style={styles.secondary}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: secondaryOpen }}
          onPress={() => {
            setSecondaryOpen((open) => {
              const next = !open;
              if (next) trackLaunchMetric('home_secondary_expand');
              return next;
            });
          }}
          style={styles.toggleRow}
          testID="tonight-secondary-toggle"
        >
          <Text style={styles.sectionLabel}>小屋裡還有</Text>
          <Text style={styles.toggleHint}>{secondaryOpen ? '收起' : '展開'}</Text>
        </Pressable>
        {secondaryOpen ? (
          <View testID="tonight-secondary-body" style={styles.secondaryBody}>
            <GhostButton testID="home-day-closure" title="今天先收工" onPress={onDayClosure} />
            <GhostButton testID="home-open-memory" title="翻閱記憶冊" onPress={onOpenMemory} />
            <GhostButton testID="home-open-settings" title="睡眠時間" onPress={onOpenSettings} />
            <GhostButton testID="home-open-moon-guard" title="月亮守護" onPress={onOpenMoonGuard} />
          </View>
        ) : null}
      </View>
    </Card>
  );
}

function toneStyle(tone: 'warm' | 'gentle' | 'quiet') {
  switch (tone) {
    case 'warm':
      return styles.toneWarm;
    case 'quiet':
      return styles.toneQuiet;
    default:
      return styles.toneGentle;
  }
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  cottageGlow: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.lg,
    height: 132,
    borderRadius: 999,
  },
  petStage: {
    width: '100%',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  contextualLine: {
    ...typography.body,
    color: colors.textPrimary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: spacing.sm,
  },
  toneWarm: { opacity: 0.98 },
  toneGentle: { opacity: 0.95 },
  toneQuiet: { opacity: 0.9 },
  secondary: {
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  toggleHint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  secondaryBody: {
    gap: spacing.sm,
  },
  muted: { ...typography.caption, color: colors.textMuted },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    overflow: 'hidden',
  },
});
