const parsed = Number(process.env.EXPO_PUBLIC_RITUAL_SECONDS ?? '30');
export const RITUAL_SECONDS = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 30;
