import type { PetArchetype } from './api/openapiTypes';

const POST_RITUAL_DREAM_LINES: Record<PetArchetype, readonly string[]> = {
  gentle: [
    '今晚，小燈把你的星星收進雲朵裡，等你睡醒再還給你。',
    '夢會先幫你把門輕輕帶上，明天再慢慢開。',
    '夜裡的風很輕，先讓呼吸跟著慢下來。',
  ],
  sleepy: [
    '今晚，睡意先把星星收進雲朵裡，等你睡醒再還給你。',
    '夢會先幫你把門帶一下，明天再慢慢開。',
    '眼皮也快下班了，夜先替你收好今天。',
  ],
  shy: [
    '今晚，門邊的燈把你的星星收進雲朵裡，等你睡醒再還給你。',
    '夢會先幫你把門輕輕帶上，明天再慢慢開。',
    '夜很安靜，先讓呼吸慢慢落下來。',
  ],
  night_owl: [
    '今晚，夜還長，但夢會先把星星收進雲朵裡，等你睡醒再還給你。',
    '行吧，夢先幫你把門帶上，明天再說。',
    '先把夜交給小屋，其餘明天再慢慢開。',
  ],
};

export function pickPostRitualDreamLine(args: {
  logicalSleepDate: string;
  petArchetype: PetArchetype;
}): string {
  const pool = POST_RITUAL_DREAM_LINES[args.petArchetype] ?? POST_RITUAL_DREAM_LINES.gentle;
  const seed = args.logicalSleepDate || 'tonight';
  const index = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0) % pool.length;
  return pool[index] ?? pool[0];
}
