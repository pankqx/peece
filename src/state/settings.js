// House settings, editable from the admin console (#/admin). Stored locally.
import { pref, setPref } from './save.js';

export const DEFAULTS = {
  betSeconds: 60, // 0 = no bet timer
  actSeconds: 45, // 0 = no action timer
  rematchSeconds: 6,
  autoRematch: true, // false = wait for "Deal again"
  rakePercent: 5, // house rake on the winner's profit
  lockoutDays: 7, // 0 = never lock out at zero tokens
  loaderEverySession: true, // false = only on the very first visit
};

const stored = pref('settings', {});
export const settings = { ...DEFAULTS, ...(stored && typeof stored === 'object' ? stored : {}) };

export function saveSettings(patch) {
  Object.assign(settings, patch);
  setPref('settings', settings);
}

export function resetSettings() {
  Object.assign(settings, DEFAULTS);
  setPref('settings', settings);
}
