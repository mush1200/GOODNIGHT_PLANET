import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Api from './api/client';
import { BreathingGlow } from './components/BreathingGlow';
import { LogicalDateHint } from './components/LogicalDateHint';
import { MemoryIllustration } from './components/MemoryIllustration';
import { PhaseTransition } from './components/PhaseTransition';
import { ScreenShell } from './components/ScreenShell';
import { SoftUnboxGlow } from './components/SoftUnboxGlow';
import { SyncStatusBar } from './components/SyncStatusBar';
import { DEVICE_KEY, rememberDeviceForMigration, restoreDeviceFromBackup } from './deviceMigration';
import {
  enqueueOfflineJob,
  flushOfflineQueue,
  OFFLINE_RETRY_COPY,
  readOfflineQueue,
} from './offlineQueue';
import { MEMORY_FOOTNOTE, worldTierStory } from './progressCopy';
import { clampWorldTierForUi, worldProgressPercent } from './progressLayout';
import { derivePushEmotionalState } from './push/pushEmotionalState';
import { getPushRegistration, registerForPushNotifications, scheduleInAppReminder } from './push/reminders';
import { ritualHintCopy, resolveEmotionalPacing } from './emotionalPacing';
import { trackLaunchMetric } from './launchMetrics';
import { RITUAL_SECONDS } from './ritualSeconds';
import { buildPushSoundProfile } from './reminderSoundProfile';
import { readNightSoundEnabled, readSoundEnabled, writeNightSoundEnabled, writeSoundEnabled } from './nightSoundPreferences';
import { useNightSoundscape } from './useNightSoundscape';
import { DayClosureScreen } from './screens/DayClosureScreen';
import { MemoryArchiveScreen } from './screens/MemoryArchiveScreen';
import { MoonGuardScreen } from './screens/MoonGuardScreen';
import { SleepSettingsScreen } from './screens/SleepSettingsScreen';
import { stardustNarrative } from './stardustNarrative';
import { pickPostRitualDreamLine } from './postRitualDreamLine';
import { userFacingError } from './userFacingError';
import { formatLogicalDateForDisplay } from './timezone';
import { TonightHome } from './TonightHome';
import { Card } from './ui/Card';
import { GhostButton } from './ui/GhostButton';
import { PrimaryButton } from './ui/PrimaryButton';
import { RitualTimer } from './ui/RitualTimer';
import { colors, spacing, typography } from './theme/tokens';
import { useReducedMotion } from './useReducedMotion';

function makeDeviceId(): string {
  return `gp_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

type Phase =
  | 'loading'
  | 'home'
  | 'ritual'
  | 'sleeping'
  | 'unboxing'
  | 'unbox-reveal'
  | 'memory'
  | 'world'
  | 'memory-archive'
  | 'sleep-settings'
  | 'moon-guard'
  | 'day-closure';

export function VerticalSliceApp() {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('loading');
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [today, setToday] = useState<Api.TodayResponse | null>(null);
  const [ritualLeft, setRitualLeft] = useState(RITUAL_SECONDS);
  const [unbox, setUnbox] = useState<Api.UnboxResponse | null>(null);
  const [memoryEntries, setMemoryEntries] = useState<Api.MemoryEntry[]>([]);
  const [moonStatus, setMoonStatus] = useState<Api.MoonGuardStatus | null>(null);
  const [moonTrigger, setMoonTrigger] = useState<Api.MoonGuardTriggerResponse | null>(null);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);
  const [petName, setPetName] = useState('小燈');
  const [reminderPreview, setReminderPreview] = useState<Api.ReminderPreview | null>(null);
  const [templateGoodnightBody, setTemplateGoodnightBody] = useState<string | null>(null);
  const [syncPending, setSyncPending] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [dayClosureMessage, setDayClosureMessage] = useState<string | null>(null);
  const [nightSoundEnabled, setNightSoundEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const countdownReported = useRef(false);
  const homeOpenTracked = useRef(false);

  const loadDevice = useCallback(async () => {
    const [soundOn, nightSoundOn] = await Promise.all([readSoundEnabled(), readNightSoundEnabled()]);
    setSoundEnabled(soundOn);
    setNightSoundEnabled(nightSoundOn);
    let id = await AsyncStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = makeDeviceId();
      await AsyncStorage.setItem(DEVICE_KEY, id);
    }
    await rememberDeviceForMigration(
      (key) => AsyncStorage.getItem(key),
      (key, value) => AsyncStorage.setItem(key, value),
    );
    setDeviceId(id);
    return id;
  }, []);

  const refreshToday = useCallback(async (id: string) => {
    const t = await Api.fetchToday(id);
    setToday(t);
    return t;
  }, []);

  const syncOffline = useCallback(async (id: string) => {
    const queue = await readOfflineQueue();
    setSyncPending(queue.length);
    if (queue.length === 0) return;
    setSyncing(true);
    const result = await flushOfflineQueue(id, {
      ritual_countdown_complete: Api.postRitualCountdownComplete,
      sleep_start: Api.postSleepStart,
      sleep_cancel: async (device) => {
        await Api.postSleepCancel(device);
      },
      day_closure_complete: async (device) => {
        await Api.postDayClosure(device, 'complete');
      },
      day_closure_skip: async (device) => {
        await Api.postDayClosure(device, 'skip');
      },
    });
    setSyncing(false);
    const remaining = await readOfflineQueue();
    setSyncPending(remaining.length);
    if (result.failed) setErr(OFFLINE_RETRY_COPY);
    if (result.flushed > 0) await refreshToday(id);
  }, [refreshToday]);

  const retryBoot = useCallback(async () => {
    if (!deviceId) return;
    setErr(null);
    setPhase('loading');
    try {
      await Api.bootstrap(deviceId);
      await syncOffline(deviceId);
      await refreshToday(deviceId);
      if (!homeOpenTracked.current) {
        homeOpenTracked.current = true;
        trackLaunchMetric('home_open');
      }
      setPhase('home');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'load_failed');
    }
  }, [deviceId, refreshToday, syncOffline]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const id = await loadDevice();
        const boot = await Api.bootstrap(id);
        setPetName(boot.petName);
        await syncOffline(id);
        const t = await refreshToday(id);
        if (!cancelled) {
          setToday(t);
          setPhase('home');
          if (!homeOpenTracked.current) {
            homeOpenTracked.current = true;
            trackLaunchMetric('home_open');
          }
        }
        const pushState = derivePushEmotionalState(t);
        const preview = await Api.fetchReminderPreview(id, 'evening_nudge', pushState);
        if (!cancelled) setReminderPreview(preview);
        try {
          const template = await Api.fetchTemplateGoodnight(id, 'evening_nudge', pushState);
          if (!cancelled) setTemplateGoodnightBody(template.body);
        } catch {
          if (!cancelled) setTemplateGoodnightBody(null);
        }
        const reg = await registerForPushNotifications();
        if (reg.enabled) {
          const soundProfile = buildPushSoundProfile({
            archetype: t.petArchetype ?? 'gentle',
            reducedMotion,
            soundEnabled,
            nightSoundEnabled,
            pushReminderEnabled: Boolean(t.pushReminderEnabled),
          });
          await scheduleInAppReminder(preview, t.targetSleepTimeLocal, soundProfile);
        }
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : 'load_failed');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadDevice, refreshToday, syncOffline, reducedMotion, nightSoundEnabled, soundEnabled]);

  const { playUiConfirm } = useNightSoundscape({
    slicePhase: phase,
    ritualSecondsLeft: phase === 'ritual' ? ritualLeft : undefined,
    petArchetype: today?.petArchetype ?? 'gentle',
    reduceMotion: reducedMotion,
    soundEnabled,
    nightSoundEnabled,
    pushSoundEnabled: Boolean(today?.pushReminderEnabled),
  });

  const postRitualDreamLine = useMemo(() => {
    if (!today) return null;
    return pickPostRitualDreamLine({
      logicalSleepDate: today.logicalSleepDate,
      petArchetype: today.petArchetype ?? 'gentle',
    });
  }, [today]);

  const setSoundPreference = useCallback(
    async (enabled: boolean) => {
      setSoundEnabled(enabled);
      await writeSoundEnabled(enabled);
      if (!enabled) {
        setNightSoundEnabled(false);
        await writeNightSoundEnabled(false);
      }
    },
    [],
  );

  const setNightSoundPreference = useCallback(
    async (enabled: boolean) => {
      setNightSoundEnabled(enabled);
      await writeNightSoundEnabled(enabled);
      if (!today?.pushReminderEnabled || !reminderPreview) return;
      const reg = getPushRegistration();
      if (!reg.enabled) return;
      const soundProfile = buildPushSoundProfile({
        archetype: today.petArchetype ?? 'gentle',
        reducedMotion,
        soundEnabled,
        nightSoundEnabled: enabled,
        pushReminderEnabled: true,
      });
      await scheduleInAppReminder(reminderPreview, today.targetSleepTimeLocal, soundProfile);
    },
    [reducedMotion, reminderPreview, soundEnabled, today],
  );

  useEffect(() => {
    if (phase !== 'ritual') {
      countdownReported.current = false;
      return;
    }
    if (ritualLeft !== 0 || !deviceId) return;
    if (countdownReported.current) return;
    countdownReported.current = true;
    let cancelled = false;
    void (async () => {
      try {
        await Api.postRitualCountdownComplete(deviceId);
        trackLaunchMetric('ritual_countdown_complete');
        const t = await refreshToday(deviceId);
        if (!cancelled) setToday(t);
      } catch {
        await enqueueOfflineJob({ type: 'ritual_countdown_complete' });
        if (!cancelled) setErr(OFFLINE_RETRY_COPY);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [phase, ritualLeft, deviceId, refreshToday]);

  useEffect(() => {
    if (phase !== 'ritual') return;
    setRitualLeft(RITUAL_SECONDS);
    const t = setInterval(() => {
      setRitualLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  const startRitual = () => {
    setErr(null);
    setCancelMessage(null);
    trackLaunchMetric('home_start_ritual_tap');
    playUiConfirm();
    setPhase('ritual');
  };

  const confirmSleep = async () => {
    if (!deviceId) return;
    try {
      if (ritualLeft > 0) return;
      await Api.postSleepStart(deviceId);
      trackLaunchMetric('ritual_sleep_start');
      playUiConfirm();
      const t = await refreshToday(deviceId);
      setToday(t);
      setPhase('sleeping');
    } catch {
      await enqueueOfflineJob({ type: 'sleep_start' });
      setErr(OFFLINE_RETRY_COPY);
    }
  };

  const leaveRitual = async () => {
    if (!deviceId) return;
    setCancelMessage(null);
    if (today?.sleeping || today?.sleepStarted) {
      try {
        const res = await Api.postSleepCancel(deviceId);
        trackLaunchMetric('ritual_cancel');
        setCancelMessage(res.message ?? '今晚先到這裡，明天再慢慢來。');
        await refreshToday(deviceId);
      } catch {
        await enqueueOfflineJob({ type: 'sleep_cancel' });
        setErr(OFFLINE_RETRY_COPY);
      }
    }
    setPhase('home');
  };

  const runDayClosure = async (action: Api.DayClosureAction) => {
    if (!deviceId) return;
    setDayClosureMessage(null);
    try {
      await Api.postDayClosure(deviceId, action);
      await refreshToday(deviceId);
      setDayClosureMessage(
        action === 'skip'
          ? '今天先略過收工，晚安流仍會在你要的時候等你。'
          : '今天的步調先到這裡，晚安流仍會在你要的時候等你。',
      );
    } catch {
      await enqueueOfflineJob({ type: action === 'skip' ? 'day_closure_skip' : 'day_closure_complete' });
      const queue = await readOfflineQueue();
      setSyncPending(queue.length);
      setErr(OFFLINE_RETRY_COPY);
    }
  };

  const wakeAndUnbox = async () => {
    if (!deviceId) return;
    try {
      setPhase('unboxing');
      await Api.postWake(deviceId);
      const u = await Api.postUnbox(deviceId);
      setUnbox(u);
      await refreshToday(deviceId);
      setPhase('unbox-reveal');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'unbox_failed');
      setPhase('sleeping');
    }
  };

  const openMemoryArchive = async () => {
    if (!deviceId) return;
    const entries = await Api.fetchMemoryEntries(deviceId);
    setMemoryEntries(entries);
    setPhase('memory-archive');
  };

  const openMoonGuard = async () => {
    if (!deviceId) return;
    if (today?.moonGuardIsoWeek) {
      setMoonStatus({
        isoWeek: today.moonGuardIsoWeek,
        usesThisWeek: today.moonGuardUsesThisWeek ?? 0,
        canUse: Boolean(today.moonGuardCanUse),
      });
    } else {
      const status = await Api.fetchMoonGuardStatus(deviceId);
      setMoonStatus(status);
    }
    setMoonTrigger(null);
    setPhase('moon-guard');
  };

  const triggerMoonGuard = async () => {
    if (!deviceId) return;
    const res = await Api.postMoonGuardTrigger(deviceId);
    setMoonTrigger(res);
    const status = await Api.fetchMoonGuardStatus(deviceId);
    setMoonStatus(status);
  };

  const restoreDevice = async () => {
    const restored = await restoreDeviceFromBackup(
      (key) => AsyncStorage.getItem(key),
      (key, value) => AsyncStorage.setItem(key, value),
    );
    if (!restored) {
      setErr('還沒有備份可還原，先讓小屋記住這台裝置。');
      return;
    }
    setDeviceId(restored);
    setErr(null);
    setPhase('loading');
    await Api.bootstrap(restored);
    await syncOffline(restored);
    await refreshToday(restored);
    setPhase('home');
  };

  const saveSleepSettings = async (payload: {
    targetSleepTimeLocal: string | null;
    wakeTimeLocal: string | null;
    pushReminderEnabled: boolean;
    earlyBedForDream: boolean;
  }) => {
    if (!deviceId) return;
    await Api.patchSleepSchedule(deviceId, {
      targetSleepTimeLocal: payload.targetSleepTimeLocal,
      wakeTimeLocal: payload.wakeTimeLocal,
      pushReminderEnabled: payload.pushReminderEnabled,
    });
    await Api.postEarlyBed(deviceId, payload.earlyBedForDream);
    await refreshToday(deviceId);
    setPhase('home');
  };

  const backHome = async () => {
    if (!deviceId) return;
    setUnbox(null);
    await refreshToday(deviceId);
    setPhase('home');
  };

  const ritualHint = useMemo(() => ritualHintCopy(ritualLeft), [ritualLeft]);

  const ritualPacing = useMemo(
    () => resolveEmotionalPacing({ phase: 'ritual', ritualSecondsLeft: ritualLeft }),
    [ritualLeft],
  );

  const errorLine = userFacingError(err);
  const unboxStardustLine = stardustNarrative(unbox?.stardustBalance);

  if (phase === 'loading' || !deviceId) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="light" />
        <View style={styles.center}>
          {err ? (
            <>
              <Text style={styles.error}>{userFacingError(err) ?? err}</Text>
              {deviceId ? <GhostButton testID="boot-retry" title="重試" onPress={() => void retryBoot()} /> : null}
            </>
          ) : (
            <>
              <ActivityIndicator color={colors.accentSoft} />
              <Text style={[styles.body, styles.muted]}>載入今夜…</Text>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScreenShell
      testID={`phase-${phase}`}
      nightSkyKey={today?.nightSky.key}
      worldAttunement={today?.worldAttunement}
      cottageWarmth={phase === 'home'}
    >
      <SafeAreaView style={styles.screen}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.scroll}>
          {phase !== 'ritual' ? <SyncStatusBar pendingCount={syncPending} syncing={syncing} /> : null}
          {phase !== 'ritual' ? <LogicalDateHint /> : null}
          {errorLine ? <Text style={styles.error}>{errorLine}</Text> : null}
          {cancelMessage ? <Text style={styles.quote}>{cancelMessage}</Text> : null}

          <PhaseTransition phaseKey={phase}>
          {phase === 'home' && today ? (
            <TonightHome
              today={today}
              onStartRitual={startRitual}
              onWakeAndUnbox={() => void wakeAndUnbox()}
              onDayClosure={() => setPhase('day-closure')}
              onOpenMemory={() => void openMemoryArchive()}
              onOpenSettings={() => setPhase('sleep-settings')}
              onOpenMoonGuard={() => void openMoonGuard()}
            />
          ) : null}

          {phase === 'ritual' && today ? (
            <Card testID="RitualCountdown">
              <BreathingGlow active={ritualPacing.allowBreathPulse && !reducedMotion} />
              <RitualTimer secondsLeft={ritualLeft} hint={ritualHint} />
              {ritualLeft === 0 && postRitualDreamLine ? (
                <Text testID="post-ritual-dream-line" style={[styles.body, styles.quote]}>
                  {postRitualDreamLine}
                </Text>
              ) : null}
              <PrimaryButton
                testID="ritual-sleep-start"
                title="我要睡了"
                disabled={ritualLeft > 0}
                onPress={() => void confirmSleep()}
                accessibilityLabel="我要睡了"
              />
              <GhostButton testID="ritual-cancel" title="今天先到此為止" onPress={() => void leaveRitual()} />
            </Card>
          ) : null}

          {phase === 'sleeping' ? (
            <Card testID="Sleeping">
              <Text style={styles.title}>正在入睡中</Text>
              <Text style={styles.body}>小屋幫你留了一盞柔光。{'\n'}醒來後我們開箱今晚的夢。</Text>
              <PrimaryButton testID="sleeping-wake-unbox" title="睡醒開箱" onPress={() => void wakeAndUnbox()} />
            </Card>
          ) : null}

          {phase === 'unboxing' ? (
            <View style={styles.center} testID="UnboxReveal-loading">
              <ActivityIndicator color={colors.accentSoft} />
              <Text style={[styles.body, styles.muted]}>開箱中…</Text>
            </View>
          ) : null}

          {phase === 'unbox-reveal' && unbox ? (
            <Card testID="UnboxReveal">
              <SoftUnboxGlow />
              <Text style={styles.title}>今夜夢境</Text>
              <MemoryIllustration dreamKey={unbox.dreamKey} nightSkyKey={today?.nightSky.key} />
              <Text style={styles.subtitle}>{unbox.dreamName}</Text>
              {unboxStardustLine ? <Text style={styles.muted}>{unboxStardustLine}</Text> : null}
              <PrimaryButton testID="unbox-to-memory" title="收進記憶冊" onPress={() => setPhase('memory')} />
            </Card>
          ) : null}

          {phase === 'memory' && unbox ? (
            <Card testID="MemorySnippet">
              <Text style={styles.title}>記憶冊 · 今夜</Text>
              <Text style={styles.muted}>{formatLogicalDateForDisplay(unbox.logicalSleepDate)}</Text>
              <MemoryIllustration dreamKey={unbox.dreamKey} nightSkyKey={today?.nightSky.key} />
              <Text style={styles.subtitle}>{unbox.dreamName}</Text>
              <Text style={[styles.body, styles.quote]}>{unbox.memoryLine}</Text>
              <Text style={styles.muted}>{MEMORY_FOOTNOTE}</Text>
              <PrimaryButton testID="memory-to-world" title="看看世界成長" onPress={() => setPhase('world')} />
            </Card>
          ) : null}

          {phase === 'world' && unbox && today ? (
            <WorldGrowthPanel today={today} onBack={() => void backHome()} />
          ) : null}

          {phase === 'memory-archive' ? (
            <MemoryArchiveScreen entries={memoryEntries} onBack={() => setPhase('home')} />
          ) : null}

          {phase === 'sleep-settings' && today ? (
            <SleepSettingsScreen
              today={today}
              reminderPreview={reminderPreview}
              templateGoodnightBody={templateGoodnightBody}
              soundEnabled={soundEnabled}
              onSoundEnabledChange={(enabled) => void setSoundPreference(enabled)}
              nightSoundEnabled={nightSoundEnabled}
              onNightSoundEnabledChange={(enabled) => void setNightSoundPreference(enabled)}
              onSave={saveSleepSettings}
              onRestoreDevice={restoreDevice}
              onBack={() => setPhase('home')}
            />
          ) : null}

          {phase === 'day-closure' ? (
            <DayClosureScreen
              completed={Boolean(today?.dayClosureCompleted || today?.dayClosureSkipped)}
              message={dayClosureMessage}
              onConfirm={() => void runDayClosure('complete')}
              onSkip={() => void runDayClosure('skip')}
              onCancel={() => setPhase('home')}
            />
          ) : null}

          {phase === 'moon-guard' && moonStatus ? (
            <MoonGuardScreen
              status={moonStatus}
              lastTrigger={moonTrigger}
              onTrigger={() => void triggerMoonGuard()}
              onBack={() => setPhase('home')}
            />
          ) : null}
          </PhaseTransition>
        </ScrollView>
      </SafeAreaView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  scroll: { padding: spacing.md, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  title: { ...typography.title, color: colors.textPrimary },
  subtitle: { ...typography.subtitle, color: colors.accentSoft },
  body: { ...typography.body, color: colors.textPrimary },
  quote: { fontStyle: 'italic', opacity: 0.95 },
  muted: { ...typography.caption, color: colors.textMuted },
  subheading: { ...typography.caption, color: colors.textMuted, marginBottom: 2 },
  timer: { ...typography.timer, color: colors.accentSoft, textAlign: 'center' },
  error: { color: '#fca5a5', marginBottom: spacing.sm },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%' as const,
    borderRadius: 4,
    backgroundColor: colors.accentSoft,
  },
});

function WorldGrowthPanel({ today, onBack }: { today: Api.TodayResponse; onBack: () => void }) {
  const wTier = clampWorldTierForUi(today.worldTier);
  const wPct = worldProgressPercent(today.worldProgressFraction);
  return (
    <Card testID="WorldProgress">
      <Text style={styles.title}>世界在長大</Text>
      <Text testID={`world-tier-story-${wTier}`} style={styles.body}>
        {worldTierStory(wTier)}
      </Text>
      <Text style={styles.muted}>
        第 {wTier} 階 · {worldTierStory(wTier)} · 本階約 {wPct}%
      </Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${wPct}%` }]} />
      </View>
      <PrimaryButton testID="world-back-home" title="回到今夜" onPress={onBack} />
    </Card>
  );
}
