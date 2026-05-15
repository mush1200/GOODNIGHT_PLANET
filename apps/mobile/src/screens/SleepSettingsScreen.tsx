import { useEffect, useState } from 'react';

import { StyleSheet, Switch, Text, View } from 'react-native';

import type { ReminderPreview, TodayResponse } from '../api/client';

import { AppTimePicker } from '../ui/AppTimePicker';

import { Card } from '../ui/Card';

import { GhostButton } from '../ui/GhostButton';

import { PrimaryButton } from '../ui/PrimaryButton';

import {

  cancelScheduledReminders,

  getPushRegistration,

  registerForPushNotifications,

  scheduleInAppReminder,

} from '../push/reminders';

import { buildPushSoundProfile } from '../reminderSoundProfile';

import { colors, spacing, typography } from '../theme/tokens';

import { useReducedMotion } from '../useReducedMotion';



type Props = {

  today: TodayResponse;

  reminderPreview?: ReminderPreview | null;

  templateGoodnightBody?: string | null;

  soundEnabled: boolean;

  onSoundEnabledChange: (enabled: boolean) => void;

  nightSoundEnabled: boolean;

  onNightSoundEnabledChange: (enabled: boolean) => void;

  onSave: (payload: {

    targetSleepTimeLocal: string | null;

    wakeTimeLocal: string | null;

    pushReminderEnabled: boolean;

    earlyBedForDream: boolean;

  }) => Promise<void>;

  onRestoreDevice?: () => Promise<void>;

  onBack: () => void;

};



export function SleepSettingsScreen({

  today,

  reminderPreview,

  templateGoodnightBody,

  soundEnabled,

  onSoundEnabledChange,

  nightSoundEnabled,

  onNightSoundEnabledChange,

  onSave,

  onRestoreDevice,

  onBack,

}: Props) {

  const reducedMotion = useReducedMotion();

  const [targetSleep, setTargetSleep] = useState(today.targetSleepTimeLocal ?? '23:00');

  const [wakeTime, setWakeTime] = useState(today.wakeTimeLocal ?? '07:30');

  const [pushEnabled, setPushEnabled] = useState(Boolean(today.pushReminderEnabled));

  const [earlyBed, setEarlyBed] = useState(Boolean(today.earlyBedForDream));

  const [pushToken, setPushToken] = useState<string | null>(getPushRegistration().expoPushToken);



  useEffect(() => {

    void (async () => {

      const reg = await registerForPushNotifications();

      setPushToken(reg.expoPushToken);

    })();

  }, []);



  const togglePush = async (next: boolean) => {

    setPushEnabled(next);

    if (!next) {

      await cancelScheduledReminders();

      return;

    }

    if (reminderPreview) {

      const soundProfile = buildPushSoundProfile({
        archetype: today.petArchetype ?? 'gentle',
        reducedMotion,
        soundEnabled,
        nightSoundEnabled,
        pushReminderEnabled: next,
      });

      await scheduleInAppReminder(reminderPreview, targetSleep, soundProfile);

    }

  };



  return (

    <Card testID="sleep-settings-screen">

      <Text style={styles.title}>睡眠時間</Text>

      <Text style={styles.muted}>就寢與起床時間只幫你記節奏，不評分。</Text>

      <Text style={styles.forecast} testID="sleep-settings-forecast">

        今夜預感：{today.forecastSummary}

      </Text>

      {typeof today.targetSleepDurationMinutes === 'number' ? (
        <Text testID="sleep-settings-duration" style={styles.muted}>
          目標睡眠約 {today.targetSleepDurationMinutes} 分鐘
        </Text>
      ) : null}

      <AppTimePicker

        label="就寢"

        value={targetSleep}

        onChange={setTargetSleep}

        testID="sleep-target-input"

      />

      <AppTimePicker label="起床" value={wakeTime} onChange={setWakeTime} testID="sleep-wake-input" />

      <View style={styles.switchRow}>

        <Text style={styles.label}>聲音</Text>

        <Switch

          testID="sound-enabled-switch"

          value={soundEnabled}

          onValueChange={onSoundEnabledChange}

        />

      </View>

      <View style={styles.switchRow}>

        <Text style={styles.label}>夜晚聲音</Text>

        <Switch

          testID="night-sound-switch"

          value={nightSoundEnabled}

          disabled={!soundEnabled}

          onValueChange={onNightSoundEnabledChange}

        />

      </View>

      <View style={styles.switchRow}>

        <Text style={styles.label}>睡前輕提醒</Text>

        <Switch

          testID="push-reminder-switch"

          value={pushEnabled}

          onValueChange={(next) => void togglePush(next)}

        />

      </View>

      <View style={styles.switchRow}>

        <Text style={styles.label}>早睡限定夢</Text>

        <Switch testID="early-bed-switch" value={earlyBed} onValueChange={setEarlyBed} />

      </View>

      {reminderPreview ? (

        <View testID="push-preview-card" style={styles.previewCard}>

          <Text style={styles.label}>提醒預覽</Text>
          {reminderPreview.title ? <Text style={styles.muted}>{reminderPreview.title}</Text> : null}
          <Text style={styles.body}>{reminderPreview.body}</Text>
          {reminderPreview.petArchetype ? (
            <Text style={styles.muted}>原型：{reminderPreview.petArchetype}</Text>
          ) : null}

          {pushToken ? <Text style={styles.muted}>裝置 token 已同步</Text> : null}

        </View>

      ) : null}

      {templateGoodnightBody ? (
        <View testID="template-goodnight-card" style={styles.previewCard}>
          <Text style={styles.label}>系統晚安模板</Text>
          <Text style={styles.body}>{templateGoodnightBody}</Text>
        </View>
      ) : null}

      <PrimaryButton

        testID="sleep-settings-save"

        title="儲存"

        onPress={() =>

          void onSave({

            targetSleepTimeLocal: targetSleep,

            wakeTimeLocal: wakeTime,

            pushReminderEnabled: pushEnabled,

            earlyBedForDream: earlyBed,

          })

        }

      />

      {onRestoreDevice ? (

        <GhostButton

          testID="sleep-settings-restore-device"

          title="還原此裝置備份"

          onPress={() => void onRestoreDevice()}

        />

      ) : null}

      <GhostButton testID="sleep-settings-back" title="回到今夜" onPress={onBack} />

    </Card>

  );

}



const styles = StyleSheet.create({

  title: { ...typography.title, color: colors.textPrimary },

  muted: { ...typography.caption, color: colors.textMuted },

  forecast: { ...typography.body, color: colors.textPrimary },

  label: { ...typography.caption, color: colors.textMuted },

  body: { ...typography.body, color: colors.textPrimary },

  switchRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    gap: spacing.md,

  },

  previewCard: {

    gap: spacing.xs,

    padding: spacing.sm,

    borderRadius: 12,

    borderWidth: 1,

    borderColor: colors.surfaceCardBorder,

    backgroundColor: 'rgba(0,0,0,0.12)',

  },

});


