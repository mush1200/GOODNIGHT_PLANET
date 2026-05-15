import { render, screen } from '@testing-library/react-native';
import { DayClosureScreen } from './DayClosureScreen';

describe('DayClosureScreen (8.2.1)', () => {
  it('shows confirm ritual before completion', () => {
    render(<DayClosureScreen onConfirm={() => {}} onSkip={() => {}} onCancel={() => {}} />);
    expect(screen.getByTestId('day-closure-confirm')).toBeOnTheScreen();
    expect(screen.getByTestId('day-closure-confirm-action')).toBeOnTheScreen();
    expect(screen.getByTestId('day-closure-skip')).toBeOnTheScreen();
  });

  it('shows feedback after completion', () => {
    render(
      <DayClosureScreen completed onConfirm={() => {}} onSkip={() => {}} onCancel={() => {}} message="今天先到這裡。" />,
    );
    expect(screen.getByTestId('day-closure-complete')).toBeOnTheScreen();
    expect(screen.getByText('今天先到這裡。')).toBeOnTheScreen();
  });
});
