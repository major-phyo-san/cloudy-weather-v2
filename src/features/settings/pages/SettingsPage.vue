<template>
  <div class="mx-auto max-w-3xl space-y-7 py-4 sm:py-8">
    <header>
      <p class="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Personalize your forecast</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">Weather settings</h1>
      <p class="mt-2 text-slate-600">Choose the units that make your forecast easiest to read.</p>
    </header>

    <form class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm" @submit.prevent="saveSettings">
      <fieldset class="border-b border-slate-100 p-6 sm:p-8">
        <legend class="text-lg font-bold text-slate-900">Temperature</legend>
        <p class="mt-1 text-sm text-slate-500">Select your preferred temperature scale.</p>
        <div class="mt-5 grid gap-3 sm:grid-cols-2">
          <label v-for="option in temperatureOptions" :key="option.value" class="flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition"
            :class="unitSettings.tempUnit === option.value ? 'border-sky-600 bg-sky-50 ring-1 ring-sky-600' : 'border-slate-200 hover:border-slate-300'">
            <input v-model="unitSettings.tempUnit" type="radio" name="temperature" :value="option.value" class="h-4 w-4 accent-sky-700" />
            <span><span class="block font-semibold text-slate-900">{{ option.label }}</span><span class="text-sm text-slate-500">{{ option.example }}</span></span>
          </label>
        </div>
      </fieldset>

      <div class="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
        <label class="block text-sm font-semibold text-slate-800" for="pressureUnit">Pressure
          <select id="pressureUnit" v-model="unitSettings.pressureUnit" class="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base font-normal text-slate-800 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100">
            <option value="hpa">Hectopascals (hPa)</option><option value="inhg">Inches of mercury (inHg)</option><option value="mbar">Millibars (mbar)</option><option value="mmhg">Millimeters of mercury (mmHg)</option><option value="psi">Pounds per square inch (PSI)</option>
          </select>
        </label>
        <label class="block text-sm font-semibold text-slate-800" for="visibilityUnit">Visibility
          <select id="visibilityUnit" v-model="unitSettings.visibilityUnit" class="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base font-normal text-slate-800 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100">
            <option value="m">Meters (m)</option><option value="km">Kilometers (km)</option><option value="ft">Feet (ft)</option><option value="mi">Miles (mi)</option>
          </select>
        </label>
        <label class="block text-sm font-semibold text-slate-800 sm:col-span-2" for="windSpeedUnit">Wind speed
          <select id="windSpeedUnit" v-model="unitSettings.windspeedUnit" class="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base font-normal text-slate-800 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100">
            <option value="ms">Meters per second (m/s)</option><option value="kmh">Kilometers per hour (km/h)</option><option value="mph">Miles per hour (mph)</option><option value="knots">Knots</option><option value="beau">Beaufort scale</option>
          </select>
        </label>
      </div>

      <div class="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p class="text-sm text-slate-500">Your choices are saved on this device.</p>
        <button type="submit" class="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">Save preferences</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { useToast } from 'vue-toastification';

const DEFAULT_UNITS = { tempUnit: 'c', pressureUnit: 'hpa', visibilityUnit: 'm', windspeedUnit: 'ms' };

export default {
  name: 'SettingsPage',
  data() {
    return {
      unitSettings: { ...DEFAULT_UNITS },
      temperatureOptions: [
        { value: 'c', label: 'Celsius', example: '°C' },
        { value: 'f', label: 'Fahrenheit', example: '°F' },
      ],
    };
  },
  computed: {
    ...mapGetters(['getUnitSettings']),
  },
  methods: {
    ...mapMutations(['setUnitSettings']),
    saveSettings() {
      this.setUnitSettings({ ...DEFAULT_UNITS, ...this.unitSettings });
      useToast().success('Your weather preferences have been saved.');
    },
  },
  created() {
    this.unitSettings = { ...DEFAULT_UNITS, ...(this.getUnitSettings || {}) };
  },
};
</script>
