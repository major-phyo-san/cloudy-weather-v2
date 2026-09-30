import { hasStorageConsent } from './consent';

export const PERSISTED_STATE_KEY = 'vuex';

export const consentedStorage = {
  getItem(key) {
    if (!hasStorageConsent()) return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    if (!hasStorageConsent()) return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Persistence is optional; the app remains usable for this session.
    }
  },
  removeItem(key) {
    if (!hasStorageConsent()) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Storage may be disabled by the browser.
    }
  },
};
