import { createStore } from 'vuex';
import createPersistedState from "vuex-persistedstate";

import AuthStore from './modules/AuthStore';
import CommonData from './modules/CommonData';

export const store = createStore({
  modules: {
      AuthStore,
      CommonData,
  },

  plugins: [createPersistedState()],
});
