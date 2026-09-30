import { createStore } from 'vuex';
import createPersistedState from "vuex-persistedstate";
import { consentedStorage } from '@/shared/privacy/consented-storage';

import auth from './modules/auth';
import commonData from './modules/common-data';
import settings from './modules/settings';

export const store = createStore({
  // Preserve the original persisted-state module keys for existing users.
  modules: { AuthStore: auth, CommonData: commonData, SettingStore: settings },
  plugins: [createPersistedState({ storage: consentedStorage })],
});
