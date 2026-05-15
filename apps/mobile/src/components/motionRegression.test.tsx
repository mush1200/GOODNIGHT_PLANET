import { render, screen } from '@testing-library/react-native';
import { PhaseTransition } from './PhaseTransition';
import { SoftUnboxGlow } from './SoftUnboxGlow';

describe('motion regression (8.1.3)', () => {
  it('renders soft unbox glow anchor', () => {
    render(<SoftUnboxGlow />);
    expect(screen.getByTestId('soft-unbox-glow')).toBeOnTheScreen();
  });

  it('wraps phase content with transition shell', () => {
    render(
      <PhaseTransition phaseKey="home">
        <></>
      </PhaseTransition>,
    );
    expect(screen.getByTestId('phase-transition')).toBeOnTheScreen();
  });
});
