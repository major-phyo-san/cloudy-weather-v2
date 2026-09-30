import { hasLocationConsent, readConsent } from '@/shared/privacy/consent';

const DEFAULT_UNIT_SETTINGS = {
  tempUnit: 'c',
  pressureUnit: 'hpa',
  visibilityUnit: 'm',
  windspeedUnit: 'ms',
};

export function initializeAppState(store, environment = import.meta.env) {
  store.commit('recordLocationConsent', readConsent().location || 'undecided');
  const configuredApiKey = environment.VITE_OPWM_KEY;
  const savedApiKey = store.getters.getOpwmKey;

  if (!savedApiKey || savedApiKey !== configuredApiKey) {
    store.commit('setOpwmKey', configuredApiKey);
  }

  const savedUnitSettings = store.getters.getUnitSettings;
  if (!savedUnitSettings || Object.keys(savedUnitSettings).length === 0) {
    store.commit('setUnitSettings', { ...DEFAULT_UNIT_SETTINGS });
  }

  const savedLocation = store.state.CommonData?.current_location;
  if (savedLocation?.source === 'browser' && !hasLocationConsent()) {
    store.commit('setCurrentLocation', {});
  }
}
