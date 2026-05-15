/** cancel_sleep／相關 API — tone_of_voice.md §5.1；`toneCompliance.test.ts` 掃描 */
export const CANCEL_SLEEP_MESSAGES = {
  no_daily_state: '今晚的小屋還沒準備好，先回來首頁一下好嗎？',
  cannot_cancel: '今晚的夢已經收好了。若想休息，我們明天再慢慢來。',
  not_started: '今晚還沒按下睡呢。想休息的時候，我們再一起來就好。',
  cancelled_ok: '好，我們先停在這裡。今天還不想結束也沒關係，小屋的燈還會在。',
} as const;

export const MOON_GUARD_MESSAGES = {
  cooldown: '這週的守護已經用過了，下次再讓小傢伙幫你留一盞光。',
  success: '小傢伙昨晚幫你守住了星光，今晚可以睡得更安心一點。',
} as const;
