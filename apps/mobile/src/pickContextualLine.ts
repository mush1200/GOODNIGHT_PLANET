import type { TodayResponse } from './api/client';
import type { PetArchetype } from './api/openapiTypes';

export type ContextualTone = 'warm' | 'gentle' | 'quiet';

export type ContextualPriorityKey =
  | 'ritual_state'
  | 'recovering'
  | 'wilted'
  | 'missed_you'
  | 'first_night'
  | 'early_bed'
  | 'steady_rhythm'
  | 'home_dock'
  | 'fallback';

export type ContextualLine = {
  line: string;
  tone: ContextualTone;
  priorityKey: ContextualPriorityKey;
};

type TodayContext = Pick<
  TodayResponse,
  | 'goodnightLine'
  | 'petArchetype'
  | 'nightsCompleted'
  | 'streakDays'
  | 'daysSinceLastOpenLogical'
  | 'earlyBedForDream'
  | 'worldAttunement'
  | 'homeDockHint'
  | 'logicalSleepDate'
  | 'ritualCountdownCompleted'
  | 'sleepStarted'
  | 'sleeping'
  | 'unboxed'
>;

type ContextualCopy = Pick<ContextualLine, 'line' | 'tone'>;

type ScriptedPriorityKey = Exclude<ContextualPriorityKey, 'fallback' | 'home_dock'>;

const CONTEXTUAL_LINES: Record<ScriptedPriorityKey, ContextualCopy> = {
  recovering: {
    line: '小屋的燈還幫你留著，慢慢回到夜晚的節奏。',
    tone: 'gentle',
  },
  wilted: {
    line: '小屋有點蔫，但燈還替你留著。',
    tone: 'quiet',
  },
  missed_you: {
    line: '你推門進來時，門邊的燈才又暖了一點。',
    tone: 'warm',
  },
  first_night: {
    line: '第一次夜裡，小傢伙在這裡等你。',
    tone: 'quiet',
  },
  early_bed: {
    line: '今晚提早收工，夢境會先幫你把門輕輕帶上。',
    tone: 'gentle',
  },
  steady_rhythm: {
    line: '連幾晚都回到這裡，屋子像記得你的腳步。',
    tone: 'warm',
  },
};

const ARCHETYPE_CONTEXTUAL_LINES: Record<
  ScriptedPriorityKey,
  Partial<Record<PetArchetype, ContextualCopy>>
> = {
  recovering: {
    sleepy: { line: '燈還亮著……你回來，我們再慢慢呼吸就好。', tone: 'gentle' },
    shy: { line: '門邊那盞燈還亮著……你若願意，就一起慢慢回來。', tone: 'quiet' },
    night_owl: { line: '晚到的夜也還等在這裡，燈還幫你留著。', tone: 'warm' },
    gentle: { line: '燈還在，我們慢慢把夜接回來。', tone: 'gentle' },
  },
  wilted: {
    sleepy: { line: '屋子有點蔫……燈還亮著，等你回來。', tone: 'quiet' },
    shy: { line: '門邊的燈……還在，只是慢了一點。', tone: 'quiet' },
    night_owl: { line: '小屋蔫了一點，但還在這裡等你。', tone: 'warm' },
    gentle: { line: '小屋有點蔫，但燈還替你留著。', tone: 'gentle' },
  },
  missed_you: {
    sleepy: { line: '你來了……門邊的燈，剛剛暖了一點點。', tone: 'quiet' },
    shy: { line: '門邊的燈……等你進來，才又暖起來。', tone: 'quiet' },
    night_owl: { line: '你總算來了；門邊的燈剛才還在等你。', tone: 'warm' },
    gentle: { line: '你回來時，門邊的燈又暖了一點。', tone: 'gentle' },
  },
  first_night: {
    sleepy: { line: '第一個夜裡……我在這裡，慢慢等你。', tone: 'quiet' },
    shy: { line: '第一次的夜……這裡有我，還有留著的燈。', tone: 'quiet' },
    night_owl: { line: '第一次進這間小屋；先把夜交給我們吧。', tone: 'warm' },
    gentle: { line: '第一次夜裡，我在這裡等你。', tone: 'gentle' },
  },
  early_bed: {
    sleepy: { line: '提早打烊……夢幫你把門帶一下，就好。', tone: 'gentle' },
    shy: { line: '今晚提早收工……夢會先幫你把門輕輕帶上。', tone: 'quiet' },
    night_owl: { line: '今晚提早收工？行吧，夢先幫你把門帶上。', tone: 'warm' },
    gentle: { line: '今晚提早收工，夢會先幫你把門帶上。', tone: 'gentle' },
  },
  steady_rhythm: {
    sleepy: { line: '連幾晚都回來……屋子好像記得你的腳步了。', tone: 'gentle' },
    shy: { line: '你幾晚都回來……屋子像記得你的腳步。', tone: 'quiet' },
    night_owl: { line: '幾晚都回來了；這屋子總算記得你腳步了吧。', tone: 'warm' },
    gentle: { line: '幾晚都回來，屋子像記得你的腳步。', tone: 'gentle' },
  },
};

const ARCHETYPE_FALLBACK_LINES: Record<PetArchetype, ContextualCopy[]> = {
  sleepy: [
    { line: '眼皮也快下班了……我們慢慢關燈。', tone: 'gentle' },
    { line: '今天先到這裡……我陪著你慢慢暗下來。', tone: 'quiet' },
    { line: '夜裡的風很輕……先讓呼吸慢下來。', tone: 'gentle' },
    { line: '星光湖的反光變柔了……我們也歇一歇。', tone: 'quiet' },
    { line: '枕邊的燈還溫著……今晚先交給夜。', tone: 'gentle' },
    { line: '今天辛苦了……我們慢慢來。', tone: 'gentle' },
  ],
  shy: [
    { line: '門邊的燈……還留著，等你。', tone: 'quiet' },
    { line: '夜裡很安靜……你可以慢慢坐下。', tone: 'quiet' },
    { line: '窗簾輕輕晃……今晚也在這裡。', tone: 'quiet' },
    { line: '星光很淡……剛好夠陪你。', tone: 'quiet' },
    { line: '小屋沒有催你……只是留著燈。', tone: 'quiet' },
    { line: '今天先到這裡……燈還在。', tone: 'quiet' },
  ],
  night_owl: [
    { line: '夜還長……但可以先歇一會兒。', tone: 'warm' },
    { line: '嘴硬說不困……燈還是幫你留著。', tone: 'warm' },
    { line: '今天的步調先到這裡，行吧。', tone: 'warm' },
    { line: '星光湖還亮著……我們慢慢收工。', tone: 'warm' },
    { line: '夜貓也有下班的時候……我陪著你。', tone: 'warm' },
    { line: '先把夜交給小屋……其餘明天再說。', tone: 'warm' },
  ],
  gentle: [
    { line: '今天辛苦了，我們慢慢來。', tone: 'gentle' },
    { line: '小屋的燈還幫你留著。', tone: 'gentle' },
    { line: '今晚把疲倦放下。', tone: 'gentle' },
    { line: '星光湖的反光變柔了。', tone: 'gentle' },
    { line: '我們把今天輕輕合上。', tone: 'gentle' },
    { line: '夜裡很安靜，你不必趕。', tone: 'gentle' },
  ],
};

function contextualCopyFor(priorityKey: ScriptedPriorityKey, archetype: PetArchetype): ContextualCopy {
  return ARCHETYPE_CONTEXTUAL_LINES[priorityKey][archetype] ?? CONTEXTUAL_LINES[priorityKey];
}

function fallbackTone(archetype: PetArchetype): ContextualTone {
  if (archetype === 'night_owl') return 'warm';
  if (archetype === 'shy' || archetype === 'sleepy') return 'quiet';
  return 'gentle';
}

function fallbackLine(today: TodayContext, archetype: PetArchetype): ContextualCopy {
  const serverLine = today.goodnightLine?.trim();
  if (serverLine) {
    return { line: serverLine, tone: fallbackTone(archetype) };
  }

  const pool = ARCHETYPE_FALLBACK_LINES[archetype];
  const seed = today.logicalSleepDate ?? 'tonight';
  const index = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0) % pool.length;
  return pool[index] ?? pool[0];
}

function pickRitualStateLine(today: TodayContext): ContextualLine | null {
  if (today.unboxed) {
    return { line: '今日的夢已收進記憶冊，明天再來喔。', tone: 'gentle', priorityKey: 'ritual_state' };
  }
  if (today.sleeping) {
    return { line: '夜裡慢慢歇著，醒來我們再開箱今晚的夢。', tone: 'quiet', priorityKey: 'ritual_state' };
  }
  if (today.sleepStarted) {
    return { line: '今晚的路先走到這裡，小屋還幫你留著燈。', tone: 'gentle', priorityKey: 'ritual_state' };
  }
  if (today.ritualCountdownCompleted) {
    return { line: '可以輕聲說晚安了，我們慢慢關燈。', tone: 'gentle', priorityKey: 'ritual_state' };
  }
  return null;
}

export function pickContextualLine(today: TodayContext): ContextualLine {
  const archetype = today.petArchetype ?? 'gentle';

  const ritualState = pickRitualStateLine(today);
  if (ritualState) return ritualState;

  if (today.worldAttunement === 'recovering') {
    return { ...contextualCopyFor('recovering', archetype), priorityKey: 'recovering' };
  }

  if (today.worldAttunement === 'wilted') {
    return { ...contextualCopyFor('wilted', archetype), priorityKey: 'wilted' };
  }

  if ((today.daysSinceLastOpenLogical ?? 0) >= 2) {
    return { ...contextualCopyFor('missed_you', archetype), priorityKey: 'missed_you' };
  }

  if (today.nightsCompleted === 0) {
    return { ...contextualCopyFor('first_night', archetype), priorityKey: 'first_night' };
  }

  if (today.earlyBedForDream === true) {
    return { ...contextualCopyFor('early_bed', archetype), priorityKey: 'early_bed' };
  }

  if (today.streakDays >= 3) {
    return { ...contextualCopyFor('steady_rhythm', archetype), priorityKey: 'steady_rhythm' };
  }

  const dockHint = today.homeDockHint?.trim();
  if (dockHint) {
    return { line: dockHint, tone: 'gentle', priorityKey: 'home_dock' };
  }

  return { ...fallbackLine(today, archetype), priorityKey: 'fallback' };
}
