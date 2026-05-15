import { render, screen } from '@testing-library/react-native';
import { worldTierStory } from './progressCopy';
import { Text } from 'react-native';

describe('tier four scene narrative (8.5.2)', () => {
  it('aligns tier-4 story with world screen copy', () => {
    render(<Text testID="world-tier-story-4">{worldTierStory(4)}</Text>);
    expect(screen.getByTestId('world-tier-story-4')).toHaveTextContent(/山線/);
  });
});
