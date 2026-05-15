import { fireEvent, render, screen } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { TonightHome } from './TonightHome';
import { makeToday } from './test/todayFixture';

const EXPO_GO_PLATFORMS = ['ios', 'android'] as const;

const noop = () => {};

describe.each(EXPO_GO_PLATFORMS)('TonightHome on %s (Expo Go)', (os) => {
  it('keeps hero hierarchy above collapsible tonight details', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: os });

    render(
      <TonightHome
        today={makeToday({
          nightsCompleted: 2,
          streakDays: 1,
          worldAttunement: 'steady',
          ritualCountdownCompleted: false,
          sleepStarted: false,
          sleeping: false,
          unboxed: false,
        })}
        onStartRitual={noop}
        onWakeAndUnbox={noop}
        onDayClosure={noop}
        onOpenMemory={noop}
        onOpenSettings={noop}
        onOpenMoonGuard={noop}
      />,
    );

    const hero = screen.getByTestId('tonight-home-hero');
    const details = screen.getByTestId('tonight-progress-panel');

    expect(hero).toBeOnTheScreen();
    expect(screen.getByTestId('pet-illustration')).toBeOnTheScreen();
    expect(screen.getByTestId('contextual-line-fallback')).toBeOnTheScreen();
    expect(screen.getByTestId('home-start-ritual')).toBeOnTheScreen();
    expect(screen.getByTestId('tonight-glance-sky')).toHaveTextContent('今晚：偏藍的月光');
    expect(screen.queryByTestId('streak-banner')).toBeNull();
    expect(screen.queryByTestId('tonight-details-body')).toBeNull();
    expect(screen.queryByTestId('tonight-secondary-body')).toBeNull();
    expect(hero.props.children).toBeTruthy();
    expect(details).toBeOnTheScreen();
  });

  it('reveals progress stats only after expanding tonight details', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: os });

    render(
      <TonightHome
        today={makeToday()}
        onStartRitual={noop}
        onWakeAndUnbox={noop}
        onDayClosure={noop}
        onOpenMemory={noop}
        onOpenSettings={noop}
        onOpenMoonGuard={noop}
      />,
    );

    fireEvent.press(screen.getByTestId('tonight-details-toggle'));

    expect(screen.getByTestId('tonight-details-body')).toBeOnTheScreen();
    expect(screen.getByTestId('streak-banner')).toBeOnTheScreen();
    expect(screen.getByTestId('world-progress-ring')).toBeOnTheScreen();
  });

  it('keeps secondary routes collapsed until expanded', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: os });

    render(
      <TonightHome
        today={makeToday()}
        onStartRitual={noop}
        onWakeAndUnbox={noop}
        onDayClosure={noop}
        onOpenMemory={noop}
        onOpenSettings={noop}
        onOpenMoonGuard={noop}
      />,
    );

    fireEvent.press(screen.getByTestId('tonight-secondary-toggle'));

    expect(screen.getByTestId('tonight-secondary-body')).toBeOnTheScreen();
    expect(screen.getByTestId('home-open-memory')).toBeOnTheScreen();
  });
});
