import { fireEvent, render, screen } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { TonightProgressPanel } from './TonightProgressPanel';
import { makeToday } from './test/todayFixture';

const EXPO_GO_PLATFORMS = ['ios', 'android'] as const;

describe.each(EXPO_GO_PLATFORMS)('TonightProgressPanel on %s (Expo Go)', (os) => {
  it('renders progress anchors and copy for 2.10', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: os });

    render(<TonightProgressPanel today={makeToday()} defaultExpanded />);

    expect(screen.getByTestId('tonight-progress-panel')).toBeOnTheScreen();
    expect(screen.getByText('今晚細節')).toBeOnTheScreen();
    expect(screen.getByText('今夜 2026 年 5 月 12 日')).toBeOnTheScreen();
    expect(screen.getByText('雲層薄，適合拍一拍肩膀。')).toBeOnTheScreen();
    expect(screen.getByText('較少見的夜空')).toBeOnTheScreen();
    expect(screen.getByTestId('streak-banner')).toBeOnTheScreen();
    expect(screen.getByText('3')).toBeOnTheScreen();
    expect(screen.getByText('連勝天')).toBeOnTheScreen();
    expect(screen.getByTestId('tier-window-1')).toBeOnTheScreen();
    expect(screen.getByTestId('tier-window-3')).toBeOnTheScreen();
    expect(screen.queryByTestId('tier-window-4')).toBeNull();
    expect(screen.getByText(/第 2 階 · 世界正慢慢亮起新的輪廓。 · 本階約 50%/)).toBeOnTheScreen();
    expect(screen.getByTestId('ritual-step-countdown')).toBeOnTheScreen();
    expect(screen.getByTestId('ritual-step-sleep')).toBeOnTheScreen();
    expect(screen.getByText(/倒數靜心完成/)).toBeOnTheScreen();
    expect(screen.getByText(/已按下「我要睡了」/)).toBeOnTheScreen();
  });

  it('clamps tier and percent for the three-window strip', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: os });

    render(
      <TonightProgressPanel
        today={makeToday({ worldTier: 5, worldProgressFraction: 1.4, streakDays: 0 })}
        defaultExpanded
      />,
    );

    expect(screen.getByText(/第 3 階 · 本階離下一個風景只差一點距離。 · 本階約 100%/)).toBeOnTheScreen();
    expect(screen.getByText('0')).toBeOnTheScreen();
  });

  it('starts collapsed until the user expands tonight details', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: os });

    render(<TonightProgressPanel today={makeToday()} />);

    expect(screen.getByTestId('tonight-glance-sky')).toHaveTextContent('今晚：偏藍的月光');
    expect(screen.getByTestId('tonight-glance-ritual')).toHaveTextContent('儀式：可以輕聲說晚安了');
    expect(screen.queryByTestId('tonight-details-body')).toBeNull();

    fireEvent.press(screen.getByTestId('tonight-details-toggle'));

    expect(screen.getByTestId('tonight-details-body')).toBeOnTheScreen();
  });
});
