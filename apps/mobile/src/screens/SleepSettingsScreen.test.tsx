import { render, screen } from '@testing-library/react-native';
import { makeToday } from '../test/todayFixture';
import { SleepSettingsScreen } from './SleepSettingsScreen';

jest.mock('../push/reminders', () => ({
  getPushRegistration: () => ({ enabled: false, expoPushToken: null }),
  registerForPushNotifications: async () => ({ enabled: false, expoPushToken: null }),
  scheduleInAppReminder: async () => null,
  cancelScheduledReminders: async () => {},
}));

jest.mock('../useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

describe('SleepSettingsScreen', () => {
  it('renders schedule controls and forecast (8.2.3)', () => {
    render(
      <SleepSettingsScreen
        today={makeToday({ targetSleepDurationMinutes: 450 })}
        reminderPreview={{
          mock: true,
          channel: 'push',
          templateKey: 'evening_nudge',
          deviceId: 'dev',
          body: '睡前輕輕回來就好。',
        }}
        templateGoodnightBody="晚安，小屋還亮著一盞燈。"
        soundEnabled
        onSoundEnabledChange={() => {}}
        nightSoundEnabled
        onNightSoundEnabledChange={() => {}}
        onSave={async () => {}}
        onBack={() => {}}
      />,
    );
    expect(screen.getByTestId('sleep-settings-screen')).toBeOnTheScreen();
    expect(screen.getByTestId('sleep-target-input')).toBeOnTheScreen();
    expect(screen.getByTestId('sleep-settings-forecast')).toBeOnTheScreen();
    expect(screen.getByTestId('push-preview-card')).toBeOnTheScreen();
    expect(screen.getByTestId('sleep-settings-duration')).toHaveTextContent('目標睡眠約 450 分鐘');
    expect(screen.getByTestId('template-goodnight-card')).toBeOnTheScreen();
    expect(screen.getByTestId('sound-enabled-switch')).toBeOnTheScreen();
    expect(screen.getByTestId('night-sound-switch')).toBeOnTheScreen();
    expect(screen.getByTestId('early-bed-switch')).toBeOnTheScreen();
  });
  it('shows restore backup when handler is provided (7.4.4)', () => {
    render(
      <SleepSettingsScreen
        today={makeToday()}
        soundEnabled
        onSoundEnabledChange={() => {}}
        nightSoundEnabled
        onNightSoundEnabledChange={() => {}}
        onSave={async () => {}}
        onRestoreDevice={async () => {}}
        onBack={() => {}}
      />,
    );
    expect(screen.getByTestId('sleep-settings-restore-device')).toBeOnTheScreen();
  });
});