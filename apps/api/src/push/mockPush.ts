import type { TemplateGoodnightKey } from '../templateGoodnight.js';
import {
  type PushEmotionalState,
  normalizePushEmotionalState,
} from '../pushEmotionalState.js';
import { normalizePetArchetype, pushTemplatePayload } from '../templateGoodnight.js';

/** 2.9.2 最小可行：推播 adapter 契約（不發真推播） */
export function buildReminderPushPayload(args: {
  deviceId: string;
  templateKey: TemplateGoodnightKey;
  petArchetype: string | null;
  pushEmotionalState?: PushEmotionalState | string | null;
}): {
  channel: 'push';
  deviceId: string;
  templateKey: TemplateGoodnightKey;
  petArchetype: string;
  pushEmotionalState: PushEmotionalState;
  title: string;
  body: string;
  mock: true;
} {
  const arch = normalizePetArchetype(args.petArchetype);
  const state = normalizePushEmotionalState(args.pushEmotionalState);
  const p = pushTemplatePayload(args.templateKey, arch, state);
  return {
    channel: 'push',
    deviceId: args.deviceId,
    templateKey: p.templateKey,
    petArchetype: p.petArchetype,
    pushEmotionalState: p.pushEmotionalState,
    title: p.title,
    body: p.body,
    mock: true,
  };
}
