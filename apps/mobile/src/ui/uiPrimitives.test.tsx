import { render, screen } from '@testing-library/react-native';
import { NarrativeTag } from './NarrativeTag';
import { ProgressRing } from './ProgressRing';
import { RitualTimer } from './RitualTimer';

describe('figma primitives (8.1.5)', () => {
  it('renders narrative tag', () => {
    render(<NarrativeTag label="較少見的夜空" />);
    expect(screen.getByTestId('narrative-tag')).toBeOnTheScreen();
  });

  it('renders progress ring', () => {
    render(<ProgressRing percent={50} />);
    expect(screen.getByTestId('progress-ring')).toBeOnTheScreen();
  });

  it('renders ritual timer', () => {
    render(<RitualTimer secondsLeft={12} hint="慢慢呼吸" />);
    expect(screen.getByTestId('ritual-timer')).toBeOnTheScreen();
  });

  it('omits ritual hint text in the final quiet window', () => {
    render(<RitualTimer secondsLeft={4} hint="" />);
    expect(screen.queryByText('慢慢呼吸')).toBeNull();
  });
});
