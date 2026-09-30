<template>
  <button v-if="!showChoices" type="button" class="fixed bottom-3 left-3 z-[90] rounded-full border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-600 shadow-lg backdrop-blur hover:text-slate-900" @click="openChoices">
    Privacy choices
  </button>

  <div v-if="showChoices" class="fixed inset-0 z-[100] grid place-items-end bg-slate-950/35 p-3 backdrop-blur-sm sm:place-items-center sm:p-6" role="presentation">
    <section class="w-full max-w-xl rounded-3xl border border-white/70 bg-white p-5 shadow-2xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="privacy-title" aria-describedby="privacy-description">
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">Your privacy</p>
      <h2 id="privacy-title" class="mt-2 text-xl font-bold text-slate-900">Cookie and app storage choices</h2>
      <p id="privacy-description" class="mt-3 text-sm leading-6 text-slate-600">
        Cloudy Weather uses a small preference cookie to remember your choice. If you allow app storage, your weather settings, saved cities, home city, and cached app files are kept in this browser. Device location is requested separately and saved only if you allow both choices. The app does not use advertising or analytics cookies.
      </p>
      <p class="mt-3 text-sm leading-6 text-slate-600">
        You can use the app without saving these details. You can change this choice later from the Privacy choices button.
      </p>
      <div v-if="locationGranted" class="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
        <span class="text-sm text-slate-600">Device location access is enabled.</span>
        <button type="button" class="shrink-0 text-sm font-semibold text-slate-700 underline underline-offset-2" @click="withdrawLocationConsent">Turn off</button>
      </div>
      <div class="mt-6 grid gap-3 sm:grid-cols-2">
        <button type="button" class="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" @click="continueWithoutStorage">
          Continue without saving
        </button>
        <button type="button" class="rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800" @click="allowStorage">
          Allow app storage
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import { initializeAppState } from '@/app/bootstrap/initialize-app-state';
import { PERSISTED_STATE_KEY } from '@/shared/privacy/consented-storage';
import { hasLocationConsent, readConsent, saveConsent } from '@/shared/privacy/consent';

export default {
  name: 'PrivacyConsent',
  data() {
    return { showChoices: readConsent().storage === undefined, locationGranted: hasLocationConsent() };
  },
  methods: {
    allowStorage() {
      let savedState = null;
      try {
        const savedValue = window.localStorage.getItem(PERSISTED_STATE_KEY);
        if (savedValue) savedState = JSON.parse(savedValue);
      } catch {
        savedState = null;
      }

      if (savedState && typeof savedState === 'object') {
        savedState.AuthStore ||= savedState.auth;
        savedState.CommonData ||= savedState.commonData;
        savedState.SettingStore ||= savedState.settings;
        delete savedState.auth;
        delete savedState.commonData;
        delete savedState.settings;
        const initialState = this.$store.state;
        this.$store.replaceState({
          ...initialState,
          ...savedState,
          AuthStore: { ...initialState.AuthStore, ...savedState.AuthStore },
          CommonData: { ...initialState.CommonData, ...savedState.CommonData },
          SettingStore: { ...initialState.SettingStore, ...savedState.SettingStore },
        });
      }

      saveConsent({ storage: 'granted' });
      initializeAppState(this.$store);
      this.$store.commit('recordStorageConsent', 'granted');
      if (import.meta.env.PROD) import('@/app/register-service-worker');
      this.showChoices = false;
    },
    continueWithoutStorage() {
      saveConsent({ storage: 'denied' });
      try {
        window.localStorage.removeItem(PERSISTED_STATE_KEY);
      } catch {
        // The app remains usable for this session when storage is unavailable.
      }
      this.$store.commit('recordStorageConsent', 'denied');
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => registrations.forEach(registration => registration.unregister()));
      }
      if ('caches' in window) {
        const appCacheNames = new Set(['city-search-data', 'google-fonts-cache', 'image-cache']);
        caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('workbox-') || appCacheNames.has(key)).map(key => caches.delete(key))));
      }
      this.showChoices = false;
    },
    withdrawLocationConsent() {
      saveConsent({ location: 'denied' });
      this.$store.commit('recordLocationConsent', 'denied');
      if (this.$store.state.CommonData?.current_location?.source === 'browser') {
        this.$store.commit('setCurrentLocation', {});
      }
      this.locationGranted = false;
    },
    openChoices() {
      this.locationGranted = hasLocationConsent();
      this.showChoices = true;
    },
  },
};
</script>
