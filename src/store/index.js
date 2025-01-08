import { createStore } from 'vuex';
import createPersistedState from "vuex-persistedstate";

import AuthStore from './modules/AuthStore';
import CommonData from './modules/CommonData';
import SettingStore from './modules/SettingStore';

export const store = createStore({
  modules: {
      AuthStore,
      CommonData,
      SettingStore
  },

  plugins: [createPersistedState()],
});
