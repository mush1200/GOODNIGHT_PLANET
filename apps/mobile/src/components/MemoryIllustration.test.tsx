import { render, screen } from '@testing-library/react-native';
import { MemoryIllustration } from './MemoryIllustration';

describe('MemoryIllustration', () => {
  it('renders illustration slot without gacha framing (8.1.2)', () => {
    render(<MemoryIllustration dreamKey="star_path" nightSkyKey="blue_moon" />);
    expect(screen.getByTestId('memory-illustration-slot')).toBeOnTheScreen();
    expect(screen.getByTestId('memory-illustration-sky-blue_moon')).toBeOnTheScreen();
    expect(screen.queryByText(/SSR|UR|圖鑑/)).toBeNull();
  });
});
