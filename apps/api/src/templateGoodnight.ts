/**
 * Push / system short copy — §5.7 checklist 2.5.5.
 * Intentionally separate from `goodnightLines.ts` (in-app 晚安一句話).
 */
import {
  type PushEmotionalState,
  normalizePushEmotionalState,
} from './pushEmotionalState.js';

export const PET_ARCHETYPES = ['gentle', 'sleepy', 'shy', 'night_owl'] as const;
export type PetArchetype = (typeof PET_ARCHETYPES)[number];

export const TEMPLATE_GOODNIGHT_KEYS = ['evening_nudge', 'ritual_invite'] as const;
export type TemplateGoodnightKey = (typeof TEMPLATE_GOODNIGHT_KEYS)[number];

const TITLES: Record<PushEmotionalState, string> = {
  recovering: '小屋重新亮燈',
  wilted: '小屋還在這裡',
  missed_you: '夜晚傳來一句話',
  early_bed: '今晚的夜空',
  steady_companion: '小屋裡還亮著燈',
  steady: '晚安星球',
};

const COPY: Record<TemplateGoodnightKey, Record<PushEmotionalState, Record<PetArchetype, string>>> = {
  evening_nudge: {
    recovering: {
      gentle: '燈又暖了一點，想回來時我在這裡。',
      sleepy: '……你回來，我們再慢慢呼吸就好。',
      shy: '門邊那盞燈還亮著……慢慢回來就好。',
      night_owl: '晚到的夜也還等在這裡，燈還幫你留著。',
    },
    wilted: {
      gentle: '小屋有點蔫，但窗邊的燈還留著。',
      sleepy: '……屋子慢了一點，燈還在。',
      shy: '門邊的燈……還在，只是慢了一點。',
      night_owl: '小屋蔫了一點，但還在這裡等你。',
    },
    missed_you: {
      gentle: '你推門進來時，門邊的燈才又暖了一點。',
      sleepy: '……你來了，門邊的燈剛暖一點點。',
      shy: '門邊的燈……等你進來，才又暖起來。',
      night_owl: '你總算來了；門邊的燈剛才還在等你。',
    },
    early_bed: {
      gentle: '今晚提早收工，夢會先幫你把門輕輕帶上。',
      sleepy: '提早打烊……夢幫你把門帶一下，就好。',
      shy: '今晚提早收工……夢會先幫你把門輕輕帶上。',
      night_owl: '今晚提早收工？行吧，夢先幫你把門帶上。',
    },
    steady_companion: {
      gentle: '小燈今天幫你把窗邊整理好了。',
      sleepy: '……今天也慢慢回來就好。',
      shy: '窗邊的燈……還留著，等你。',
      night_owl: '今晚的風有點安靜。',
    },
    steady: {
      gentle: '今晚先到這裡，我們慢慢收。',
      sleepy: '……眼皮在排隊下班了，一起慢慢走嗎？',
      shy: '門邊的燈還亮著，你想來時再走就好。',
      night_owl: '還不想睡也沒關係，先把今天輕輕放下。',
    },
  },
  ritual_invite: {
    recovering: {
      gentle: '一起用一小段時間，把夜慢慢接回來。',
      sleepy: '倒數一下下……像把腳步放慢那樣。',
      shy: '不用說很多，按開始，我會陪著。',
      night_owl: '嘴上還早，身體可以先試三十秒。',
    },
    wilted: {
      gentle: '小屋還在，一起用一小段時間說晚安。',
      sleepy: '……倒數一下下，慢慢回來就好。',
      shy: '燈還亮著……按開始，我陪著。',
      night_owl: '小屋還在這裡，試試三十秒也好。',
    },
    missed_you: {
      gentle: '小屋準備好了，一起用一小段時間說晚安。',
      sleepy: '倒數一下下……像把腳步放慢那樣。',
      shy: '不用說很多，只要按開始，我會陪著。',
      night_owl: '嘴上說還早，身體可以先試試看三十秒。',
    },
    early_bed: {
      gentle: '提早收工的夜晚，也留一段時間說晚安。',
      sleepy: '……提早的夜，也慢慢倒數一下下。',
      shy: '今晚提早……按開始，我陪著就好。',
      night_owl: '提早收工？那先試三十秒儀式吧。',
    },
    steady_companion: {
      gentle: '小屋準備好了，一起用一小段時間說晚安。',
      sleepy: '倒數一下下……像把腳步放慢那樣。',
      shy: '不用說很多，只要按開始，我會陪著。',
      night_owl: '嘴上說還早，身體可以先試試看三十秒。',
    },
    steady: {
      gentle: '小屋準備好了，一起用一小段時間說晚安。',
      sleepy: '倒數一下下……像把腳步放慢那樣。',
      shy: '不用說很多，只要按開始，我會陪著。',
      night_owl: '嘴上說還早，身體可以先試試看三十秒。',
    },
  },
};

export function normalizePetArchetype(raw: string | null | undefined): PetArchetype {
  if (raw && (PET_ARCHETYPES as readonly string[]).includes(raw)) {
    return raw as PetArchetype;
  }
  return 'gentle';
}

export function pushTemplateTitle(state: PushEmotionalState): string {
  return TITLES[state];
}

export function templateGoodnightBody(
  key: TemplateGoodnightKey,
  archetype: PetArchetype,
  emotionalState: PushEmotionalState = 'steady',
): string {
  const state = normalizePushEmotionalState(emotionalState);
  return COPY[key][state][archetype];
}

export function allTemplateGoodnightBodies(): string[] {
  const out: string[] = [];
  for (const key of TEMPLATE_GOODNIGHT_KEYS) {
    for (const state of Object.keys(COPY[key]) as PushEmotionalState[]) {
      for (const arch of PET_ARCHETYPES) {
        out.push(templateGoodnightBody(key, arch, state));
      }
    }
  }
  return out;
}

export function pushTemplatePayload(
  key: TemplateGoodnightKey,
  archetype: PetArchetype,
  emotionalState: PushEmotionalState = 'steady',
): {
  templateKey: TemplateGoodnightKey;
  petArchetype: PetArchetype;
  pushEmotionalState: PushEmotionalState;
  title: string;
  body: string;
  channel: 'push';
} {
  const state = normalizePushEmotionalState(emotionalState);
  return {
    templateKey: key,
    petArchetype: archetype,
    pushEmotionalState: state,
    title: pushTemplateTitle(state),
    body: templateGoodnightBody(key, archetype, state),
    channel: 'push',
  };
}
