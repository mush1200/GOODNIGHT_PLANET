import { render, screen } from '@testing-library/react-native';
import type { MemoryEntry } from '../api/client';
import { MemoryArchiveScreen } from './MemoryArchiveScreen';

const entries: MemoryEntry[] = [
  {
    id: '1',
    logicalSleepDate: '2026-05-10',
    dreamKey: 'star_path',
    nightSkyKey: 'clear_star',
    narrative: '今晚記住了：腳下有一條細細的星光小路。',
    createdAt: '2026-05-11T00:00:00.000Z',
  },
];

describe('MemoryArchiveScreen', () => {
  it('lists memory entries with dream names (8.2.4)', () => {
    render(<MemoryArchiveScreen entries={entries} onBack={() => {}} />);
    expect(screen.getByTestId('memory-archive-screen')).toBeOnTheScreen();
    expect(screen.getByTestId('memory-entry-2026-05-10')).toBeOnTheScreen();
    expect(screen.getByTestId('memory-entry-name-2026-05-10')).toHaveTextContent('星光夢');
    expect(screen.getByText('2026 年 5 月 11 日')).toBeOnTheScreen();
  });
});
