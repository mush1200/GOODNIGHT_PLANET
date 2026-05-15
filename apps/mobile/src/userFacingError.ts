const ERROR_COPY: Record<string, string> = {
  load_failed: '小屋還在整理門簾，晚一點再試試。',
  unbox_failed: '開箱這一步先暫停，醒來後再慢慢打開。',
  bootstrap_401: '還沒認得這台裝置，讓小屋重新記住你。',
  today_401: '還沒認得這台裝置，讓小屋重新記住你。',
};

export function userFacingError(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (ERROR_COPY[raw]) return ERROR_COPY[raw];
  if (/^[a-z_]+_\d+$/.test(raw) || /^[a-z_]+$/.test(raw)) {
    return '這一步先暫時卡住，晚點再回來也沒關係。';
  }
  return raw;
}
