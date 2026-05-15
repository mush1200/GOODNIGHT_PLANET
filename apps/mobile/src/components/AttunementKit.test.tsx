import { render, screen } from '@testing-library/react-native';
import { AttunementKit } from './AttunementKit';

describe('AttunementKit (8.1.4)', () => {
  it('renders hint and rarity tag together', () => {
    render(
      <AttunementKit state="wilted" hint="小屋有點蔫，但還在等你。" rarityTag="較少見的夜空" />,
    );
    expect(screen.getByTestId('attunement-kit')).toBeOnTheScreen();
    expect(screen.getByText('小屋有點蔫，但還在等你。')).toBeOnTheScreen();
    expect(screen.getByTestId('attunement-rarity-tag')).toBeOnTheScreen();
  });
});
