import { render, screen } from '@testing-library/react-native';
import { BreathingGlow } from './BreathingGlow';

describe('BreathingGlow', () => {
  it('renders ritual glow without gacha effects (7.1.3)', () => {
    render(<BreathingGlow active />);
    expect(screen.getByTestId('breathing-glow')).toBeOnTheScreen();
  });
});
