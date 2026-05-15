import { render, screen } from '@testing-library/react-native';
import { LogicalDateHint } from './LogicalDateHint';
import { SyncStatusBar } from './SyncStatusBar';

describe('reliable UX chrome (8.3)', () => {
  it('shows sync status when queue pending', () => {
    render(<SyncStatusBar pendingCount={2} />);
    expect(screen.getByTestId('sync-status-bar')).toBeOnTheScreen();
    expect(screen.getByText(/已暫存 2 步/)).toBeOnTheScreen();
  });

  it('shows logical rollover hint before sleep rollover hour', () => {
    render(<LogicalDateHint now={new Date('2026-05-13T02:30:00+08:00')} />);
    expect(screen.getByTestId('logical-date-hint')).toBeOnTheScreen();
  });
});
