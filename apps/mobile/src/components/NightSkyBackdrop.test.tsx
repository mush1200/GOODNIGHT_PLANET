import { render, screen } from '@testing-library/react-native';
import { NightSkyBackdrop } from './NightSkyBackdrop';

describe('NightSkyBackdrop', () => {
  it('renders asset id and scene layers for nightSky key (8.1.1)', () => {
    render(<NightSkyBackdrop nightSkyKey="soft_rain" />);
    expect(screen.getByTestId('night-sky-backdrop')).toBeOnTheScreen();
    expect(screen.getByTestId('night-sky-asset-bg_soft_rain')).toBeOnTheScreen();
    expect(screen.getByTestId('night-sky-scene-soft_rain')).toBeOnTheScreen();
    expect(screen.getByTestId('night-sky-layer-rain')).toBeOnTheScreen();
  });
});
