import { render, screen } from '@testing-library/react-native';
import { MoonGuardScreen } from './MoonGuardScreen';

describe('MoonGuardScreen', () => {
  it('renders narrative entry (8.2.2)', () => {
    render(
      <MoonGuardScreen
        status={{ isoWeek: '2026-W19', usesThisWeek: 0, canUse: true }}
        lastTrigger={{ ok: false, error: 'on_cooldown', isoWeek: '2026-W19', usesThisWeek: 1, message: '本週已用過' }}
        onTrigger={() => {}}
        onBack={() => {}}
      />,
    );
    expect(screen.getByTestId('moon-guard-screen')).toBeOnTheScreen();
    expect(screen.getByTestId('moon-guard-narrative-entry')).toBeOnTheScreen();
    expect(screen.getByTestId('moon-guard-trigger')).toBeOnTheScreen();
    expect(screen.getByTestId('moon-guard-cooldown')).toBeOnTheScreen();
  });
});
