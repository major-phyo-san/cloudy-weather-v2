<template>
  <div class="mx-auto max-w-6xl space-y-8 py-4 sm:py-8">
    <section class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Your local forecast</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Cloudy Weather</h1>
        <p class="mt-2 text-slate-600">A clear view of the weather around you.</p>
      </div>
      <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        <div class="relative w-full sm:w-80">
          <label class="sr-only" for="city-search">Search for a city</label>
          <input id="city-search" v-model="cityQuery" type="search" autocomplete="off" placeholder="Search any city…"
            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            @input="searchCities" />
          <div v-if="citySearchLoading" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500" role="status">Loading cities…</div>
          <div v-else-if="cityQuery.trim().length >= 2" class="absolute left-0 right-0 top-full z-40 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur-xl">
            <p v-if="citySearchError" class="px-3 py-3 text-sm text-rose-700" role="alert">{{ citySearchError }}</p>
            <p v-else-if="!citySearchResults.length" class="px-3 py-3 text-sm text-slate-500">{{ citySearchReady ? 'No matching cities found.' : 'Type to search the city list.' }}</p>
            <button v-for="city in citySearchResults" :key="`${city[0]}-${city[1]}-${city[2]}-${city[3]}-${city[4]}`" type="button"
              class="flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-sky-50 focus:bg-sky-50 focus:outline-none"
              @click="selectCity(city)">
              <span class="font-medium text-slate-800">{{ city[0] }}<span v-if="city[1]" class="font-normal text-slate-500">, {{ city[1] }}</span></span>
              <span class="shrink-0 text-xs text-slate-500">{{ countryName(city[2]) }}</span>
            </button>
          </div>
        </div>
        <button type="button" :disabled="isLoading" @click="refreshWeather"
          class="inline-flex items-center justify-center rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-sky-800 disabled:cursor-wait disabled:opacity-60">
          <svg class="mr-2 h-4 w-4" :class="{ 'animate-spin': isLoading }" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 7v5h-5M4 17v-5h5m10.1-2A7 7 0 0 0 6.2 7L4 9m16 6-2.2 2A7 7 0 0 1 4.9 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ isLoading ? 'Updating…' : 'Refresh weather' }}
        </button>
        <button type="button" :disabled="isLoading" @click="requestBrowserLocation" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60">
          Use my location
        </button>
      </div>
    </section>

    <section v-if="locationError" class="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950" role="alert">
      <h2 class="font-semibold">Location unavailable</h2>
      <p class="mt-1 text-sm">{{ locationError }}</p>
      <button class="mt-3 font-semibold underline underline-offset-2" type="button" @click="requestBrowserLocation">Try location again</button>
    </section>

    <section v-if="showLocationConsent" class="rounded-3xl border border-sky-200 bg-sky-50 p-5 sm:p-6" aria-labelledby="location-consent-title">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Optional location access</p>
      <h2 id="location-consent-title" class="mt-2 text-lg font-bold text-slate-900">Use your device location?</h2>
      <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">If you allow it, Cloudy Weather will read your device’s approximate location to request a local forecast from OpenWeather. Your coordinates may be saved in this browser only if you also allow app storage. You can search for a city instead.</p>
      <div class="mt-4 flex flex-wrap gap-3">
        <button type="button" class="rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800" @click="allowDeviceLocation">Allow location</button>
        <button type="button" class="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" @click="declineDeviceLocation">Choose a city instead</button>
      </div>
    </section>

    <section v-if="pageError" class="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-950" role="alert">
      <h2 class="font-semibold">{{ currentWeather ? 'Forecast is temporarily unavailable' : 'Weather could not be loaded' }}</h2>
      <p class="mt-1 text-sm">{{ pageError }}</p>
      <button class="mt-3 font-semibold underline underline-offset-2" type="button" @click="refreshWeather">Try again</button>
    </section>

    <template v-if="isLoading && !currentWeather">
      <div class="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]" aria-label="Loading weather" aria-busy="true">
        <div class="h-72 animate-pulse rounded-3xl bg-slate-200"></div>
        <div class="h-72 animate-pulse rounded-3xl bg-slate-200"></div>
      </div>
    </template>

    <section v-if="currentWeather" class="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <article class="overflow-hidden rounded-3xl p-6 text-white shadow-lg transition-colors duration-700 sm:p-9" :style="{ background: currentConditionGradient }">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-sky-100">Current conditions</p>
            <h2 class="mt-1 text-2xl font-bold sm:text-3xl">{{ currentWeather.city }}</h2>
            <p class="mt-1 capitalize text-sky-100">{{ currentWeather.description }}</p>
          </div>
          <img :src="iconUrl(currentWeather.main_icon)" :alt="currentWeather.main" class="h-16 w-16 sm:h-20 sm:w-20" />
        </div>
        <div class="mt-8 flex flex-wrap items-end justify-between gap-5">
          <p class="text-6xl font-semibold tracking-tight sm:text-7xl">{{ currentWeather.temperature }}</p>
          <p class="rounded-xl bg-white/10 px-4 py-3 text-sm text-sky-50">H {{ currentWeather.temp_max }} <span class="mx-1 text-sky-200">/</span> L {{ currentWeather.temp_min }}</p>
        </div>
        <p class="mt-6 border-t border-white/20 pt-4 text-sm text-sky-100">Feels like {{ currentWeather.feels_like }} <span class="mx-2">·</span> Updated {{ currentWeather.updated_on }}</p>
        <div class="mt-5" aria-label="Temperature color scale">
          <div class="relative mb-2 h-3 text-[9px] font-semibold uppercase tracking-wide text-white/80 sm:text-[10px]">
            <span v-for="category in temperatureScaleCategories" :key="category.label" class="absolute whitespace-nowrap" :class="category.edge" :style="{ left: category.position }">{{ category.label }}</span>
          </div>
          <div class="relative h-2.5 rounded-full" :style="{ background: temperatureScaleGradient }">
            <span class="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-900 shadow-md" :style="{ left: temperatureScalePosition }" aria-hidden="true"></span>
          </div>
          <div class="relative mt-1.5 h-3 text-[9px] text-white/75 sm:text-[10px]">
            <span v-for="tick in temperatureScaleTicks" :key="tick.celsius" class="absolute whitespace-nowrap" :class="tick.edge" :style="{ left: tick.position }">{{ tick.label }}</span>
          </div>
        </div>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">At a glance</p>
        <div class="mt-5 grid grid-cols-2 gap-3">
          <div v-for="item in highlightDetails" :key="item.label" class="flex min-w-0 items-center justify-between gap-2 rounded-2xl bg-slate-50 p-3 sm:p-4">
            <div class="min-w-0">
              <p class="text-xs text-slate-500 sm:text-sm">{{ item.label }}</p>
              <p class="mt-1 truncate text-base font-semibold text-slate-900 sm:text-lg">{{ item.value }}</p>
            </div>
            <svg v-if="item.kind === 'sunset'" viewBox="0 0 64 48" class="h-11 w-14 shrink-0 text-orange-500" fill="none" aria-hidden="true">
              <path d="M7 38h50M13 36a19 19 0 0 1 38 0" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              <path d="M32 5v8m-19 4 6 5m26-5-6 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <circle cx="32" cy="33" r="5" fill="currentColor" />
            </svg>
            <svg v-else viewBox="0 0 56 56" class="h-12 w-12 shrink-0" aria-hidden="true">
              <circle cx="28" cy="28" r="22" fill="none" stroke="#dbeafe" stroke-width="4" />
              <circle cx="28" cy="28" r="22" fill="none" :stroke="item.color" stroke-width="4" stroke-linecap="round" pathLength="100" stroke-dasharray="100" :stroke-dashoffset="100 - item.progress" transform="rotate(-90 28 28)" />
              <path v-if="item.kind === 'humidity'" d="M28 15c-3 6-8 10-8 16a8 8 0 0 0 16 0c0-6-5-10-8-16Z" :fill="item.color" />
              <g v-else-if="item.kind === 'uv'" :stroke="item.color" stroke-width="2.5" stroke-linecap="round">
                <circle cx="28" cy="28" r="6" fill="none" />
                <path d="M28 14v-3m0 34v-3M14 28h-3m34 0h-3M18 18l-2-2m24 24-2-2m0-20 2-2m-24 24 2-2" />
              </g>
              <g v-else-if="item.kind === 'feels'" :stroke="item.color" stroke-width="2.5" stroke-linecap="round" fill="none">
                <path d="M25 14a4 4 0 0 1 8 0v17a8 8 0 1 1-8 0V14Z" />
                <path d="M29 23v13" />
              </g>
              <g v-else-if="item.kind === 'wind'" :stroke="item.color" stroke-width="2.5" stroke-linecap="round" fill="none">
                <path d="M13 23h24a5 5 0 1 0-5-5m-19 15h30a5 5 0 1 1-5 5" />
              </g>
              <g v-else :stroke="item.color" stroke-width="2.5" stroke-linecap="round" fill="none">
                <path d="M28 14v18m-6-6 6 6 6-6M18 40h20" />
              </g>
            </svg>
          </div>
        </div>
      </article>
    </section>

    <section v-if="currentWeather" class="grid gap-5 md:grid-cols-2">
      <article v-for="section in detailSections" :key="section.title" class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900">{{ section.title }}</h2>
        <dl class="mt-4 grid gap-3 sm:grid-cols-2">
          <div v-for="item in section.items" :key="item.label" class="min-w-0 rounded-2xl bg-slate-50 p-3.5" :class="item.kind === 'solar-times' ? 'sm:col-span-2' : ''">
            <div v-if="item.kind === 'solar-times'" class="grid grid-cols-2 divide-x divide-amber-200/80">
              <div v-for="solar in item.times" :key="solar.label" class="flex items-center gap-3 px-2 first:pl-0 last:pr-0">
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <svg v-if="solar.label === 'Sunrise'" viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M3 18h18M6 17a6 6 0 0 1 12 0m-6-14v8m-4-4 4-4 4 4" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M3 18h18M6 17a6 6 0 0 1 12 0m-6-14v8m-4 0 4 4 4-4" />
                  </svg>
                </span>
                <div class="min-w-0">
                  <dt class="text-xs font-medium text-slate-500">{{ solar.label }}</dt>
                  <dd class="mt-1 text-sm font-semibold text-slate-800">{{ solar.value }}</dd>
                </div>
              </div>
            </div>
            <div v-else class="flex items-center gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" :class="item.iconBg">
                <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path v-if="item.icon === 'drop'" d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Z" />
                  <path v-else-if="item.icon === 'cloud'" d="M7 18h10a4 4 0 0 0 .4-8A6 6 0 0 0 6 9a4.5 4.5 0 0 0 1 9Z" />
                  <path v-else-if="item.icon === 'sun'" d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v2m0 14v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M3 12h2m14 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                  <template v-else-if="item.icon === 'eye'"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></template>
                  <path v-else-if="item.icon === 'wind'" d="M3 8h12a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M4 16h7" />
                  <path v-else-if="item.icon === 'compass'" d="m12 3 2.5 7.5L21 13l-7.5 2.5L11 22l-2.5-6.5L2 13l6.5-2.5L12 3Z" />
                  <path v-else-if="item.icon === 'snow'" d="M12 2v20m-8-15 16 10M20 7 4 17m4-13 4 3 4-3m-8 13 4-3 4 3m-12-8 4 1 1-4m11 10-4-1-1 4m1-14-1 4-4-1m-7 11 1-4 4 1" />
                  <path v-else-if="item.icon === 'leaf'" d="M20 4C11 4 5 6 5 13a5 5 0 0 0 5 5c7 0 9-6 10-14ZM4 21c2-5 6-8 11-11" />
                  <path v-else-if="item.icon === 'pressure'" d="M4 16a8 8 0 1 1 16 0M12 12l4-4m-9 9h10" />
                  <path v-else d="M15 5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0V5Zm-3 7v6" />
                </svg>
              </span>
              <div class="min-w-0 flex-1">
                <dt class="text-xs font-medium text-slate-500">{{ item.label }}</dt>
                <dd class="mt-1 truncate text-sm font-semibold text-slate-800">{{ item.value }}</dd>
              </div>
            </div>
            <div v-if="item.progress !== null" class="mt-3 h-1.5 overflow-hidden rounded-full bg-white" role="progressbar" :aria-label="item.label" :aria-valuenow="item.progress" aria-valuemin="0" aria-valuemax="100">
              <span class="block h-full rounded-full transition-[width] duration-500" :class="item.barColor" :style="{ width: `${item.progress}%` }"></span>
            </div>
          </div>
        </dl>
      </article>
    </section>

    <TemperatureChart
      :forecast-days="fiveDayForecast"
      :current-conditions="currentWeather"
      :sunrise="currentWeather?.sunrise_timestamp"
      :sunset="currentWeather?.sunset_timestamp"
      :temperature-unit="getUnitSettings?.tempUnit || 'c'"
    />

    <section v-if="fiveDayForecast.length" class="space-y-4">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">Plan ahead</p>
        <h2 class="mt-1 text-2xl font-bold text-slate-900">5-day forecast</h2>
      </div>
      <div class="grid items-start gap-4 rounded-[2rem] bg-gradient-to-br from-sky-100/70 via-indigo-100/45 to-rose-100/35 p-2" :style="{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))' }">
        <article v-for="day in fiveDayForecast" :key="day.date" class="min-w-0 rounded-3xl border border-white/80 bg-white/80 p-4 shadow-lg backdrop-blur-lg sm:p-5">
          <div class="mb-4 flex items-center justify-between gap-4">
            <div class="min-w-0">
              <h3 class="font-bold text-slate-900">{{ day.date }}</h3>
              <p class="mt-1 text-xs font-medium text-slate-600"><span class="text-rose-700">H {{ day.high }}</span><span class="mx-1.5 text-slate-300">/</span><span class="text-sky-800">L {{ day.low }}</span></p>
            </div>
            <span class="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span v-if="day.forecasts.length > 1" class="relative inline-flex h-5 w-6 items-center" aria-hidden="true">
                <span class="absolute left-0 top-1 h-4 w-4 rotate-[-12deg] rounded border border-sky-200 bg-sky-100/80"></span>
                <span class="absolute left-1 top-0.5 h-4 w-4 rotate-[6deg] rounded border border-sky-200 bg-white/70"></span>
                <span class="absolute left-2 top-0 h-4 w-4 rounded border border-sky-300 bg-white/80"></span>
              </span>
              <span>{{ Math.min(forecastIndex(day) + 1, day.forecasts.length) }} / {{ day.forecasts.length }}</span>
            </span>
          </div>
          <div class="relative h-[27rem] select-none" :aria-label="`Hourly forecast deck for ${day.date}`">
            <div v-for="(hour, visibleIndex) in day.forecasts.slice(forecastIndex(day), forecastIndex(day) + 3)"
              :key="`${day.date}-${forecastIndex(day) + visibleIndex}`"
              class="absolute inset-0 overflow-y-auto rounded-2xl border p-4 shadow-xl sm:p-5"
              :class="visibleIndex === 0 ? 'touch-pan-y cursor-grab border-white/90 bg-white/90 backdrop-blur-2xl active:cursor-grabbing' : 'pointer-events-none border-sky-200/80 bg-gradient-to-br from-sky-100/90 to-indigo-100/80 shadow-md'"
              :style="forecastCardStyle(day, visibleIndex)"
              :aria-hidden="visibleIndex !== 0"
              @pointerdown="startForecastSwipe($event, day, visibleIndex)"
              @pointermove="moveForecastSwipe($event, day, visibleIndex)"
              @pointerup="finishForecastSwipe($event, day, visibleIndex)"
              @pointercancel="cancelForecastSwipe(day)">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-slate-700">{{ hour.time }}</span>
                <img :src="iconUrl(hour.main_icon)" :alt="hour.main_text" class="h-9 w-9" />
              </div>
              <p class="mt-3 text-2xl font-bold text-slate-900">{{ hour.temperature }}</p>
              <p class="mt-1 text-xs font-medium text-slate-500"><span class="text-rose-700">H {{ hour.high }}</span><span class="mx-1.5 text-slate-300">/</span><span class="text-sky-800">L {{ hour.low }}</span></p>
              <p class="mt-1 truncate text-sm capitalize text-slate-500">{{ hour.description }}</p>
              <dl class="mt-4 space-y-2 border-t border-slate-200 pt-3">
                <div v-for="(value, label) in hour.details" :key="label" class="flex justify-between gap-2 text-xs">
                  <dt class="text-slate-500">{{ label }}</dt><dd class="text-right font-medium text-slate-700">{{ value }}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between gap-3">
            <p class="text-xs text-slate-500">Swipe the card left or right for the next hour</p>
            <button type="button" class="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-sky-800 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:text-slate-400" :disabled="day.forecasts.length <= 1" @click="advanceForecast(day)">
              {{ forecastIndex(day) === day.forecasts.length - 1 ? 'Restart deck' : 'Next hour' }} <span aria-hidden="true">→</span>
            </button>
          </div>
        </article>
      </div>
    </section>
    <section v-else-if="!isLoading && currentWeather" class="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
      Forecast data is temporarily unavailable. Current conditions are still shown above.
    </section>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { fetchWeatherBundle } from '@/features/weather/services/weather-service';
import { makeFormattedCurrentWeatherData, makeFormattedWeatherForecastData } from '@/features/weather/utils/data-formatters';
import { cityDisplayName, searchCityDirectory } from '@/features/cities/services/city-directory';
import TemperatureChart from '@/features/weather/components/TemperatureChart.vue';
import { hasLocationConsent, hasLocationChoiceBeenMadeThisSession, markLocationChoiceForSession, saveConsent } from '@/shared/privacy/consent';

const TEMPERATURE_COLOR_STOPS = [
  [-10, '#1e3a8a'], [0, '#075985'], [10, '#0e7490'], [20, '#0f766e'],
  [25, '#b45309'], [30, '#c2410c'], [40, '#b91c1c'], [45, '#7f1d1d'],
];

function interpolateColor(start, end, amount) {
  const channel = (offset) => {
    const from = parseInt(start.slice(offset, offset + 2), 16);
    const to = parseInt(end.slice(offset, offset + 2), 16);
    return Math.round(from + (to - from) * amount).toString(16).padStart(2, '0');
  };
  return `#${channel(1)}${channel(3)}${channel(5)}`;
}

export default {
  name: 'HomePage',
  components: { TemperatureChart },
  data() {
    return {
      currentWeather: null,
      fiveDayForecast: [],
      isLoading: true,
      pageError: null,
      locationError: null,
      activeRequest: 0,
      cityQuery: '',
      citySearchResults: [],
      citySearchLoading: false,
      citySearchReady: false,
      citySearchError: null,
      citySearchTimer: null,
      citySearchRequestId: 0,
      locationRequestId: 0,
      showLocationConsent: false,
      weatherLocationSource: null,
      forecastPositions: {},
      swipeOffsets: {},
      swipeStarts: {},
      swipeAnimating: {},
    };
  },
  computed: {
    ...mapGetters(['getOpwmKey', 'getCurrentLocation', 'getUnitSettings', 'getHomeCity', 'getLocationConsent']),
    currentConditionGradient() {
      const temperature = Number(this.currentWeather?.temperature_c);
      const stops = TEMPERATURE_COLOR_STOPS;
      if (!Number.isFinite(temperature)) return 'linear-gradient(125deg, #075985, #1e3a8a)';
      const clamped = Math.max(stops[0][0], Math.min(stops[stops.length - 1][0], temperature));
      const upperIndex = stops.findIndex(([limit]) => limit >= clamped);
      const lower = stops[Math.max(0, upperIndex - 1)];
      const upper = stops[Math.max(0, upperIndex)];
      const amount = upper[0] === lower[0] ? 0 : (clamped - lower[0]) / (upper[0] - lower[0]);
      const middle = interpolateColor(lower[1], upper[1], amount);
      return `linear-gradient(125deg, ${lower[1]} 0%, ${middle} 52%, ${upper[1]} 100%)`;
    },
    temperatureScaleGradient() {
      const minimum = TEMPERATURE_COLOR_STOPS[0][0];
      const maximum = TEMPERATURE_COLOR_STOPS[TEMPERATURE_COLOR_STOPS.length - 1][0];
      const scaleStops = TEMPERATURE_COLOR_STOPS.map(([temperature, color]) => `${color} ${((temperature - minimum) / (maximum - minimum)) * 100}%`);
      return `linear-gradient(90deg, ${scaleStops.join(', ')})`;
    },
    temperatureScalePosition() {
      const temperature = Number(this.currentWeather?.temperature_c);
      if (!Number.isFinite(temperature)) return '50%';
      const minimum = TEMPERATURE_COLOR_STOPS[0][0];
      const maximum = TEMPERATURE_COLOR_STOPS[TEMPERATURE_COLOR_STOPS.length - 1][0];
      return `${Math.max(0, Math.min(100, ((temperature - minimum) / (maximum - minimum)) * 100))}%`;
    },
    temperatureScaleTicks() {
      const minimum = TEMPERATURE_COLOR_STOPS[0][0];
      const maximum = TEMPERATURE_COLOR_STOPS[TEMPERATURE_COLOR_STOPS.length - 1][0];
      const fahrenheit = this.getUnitSettings?.tempUnit === 'f';
      return [-10, 0, 10, 20, 30, 40, 45].map(celsius => {
        const value = fahrenheit ? Math.round(celsius * 9 / 5 + 32) : celsius;
        const edge = celsius === minimum ? 'left-0' : celsius === maximum ? 'right-0' : '-translate-x-1/2';
        const label = celsius === minimum ? `≤ ${value}°${fahrenheit ? 'F' : 'C'}` : celsius === maximum ? `${value}°${fahrenheit ? 'F' : 'C'}+` : `${value}°${fahrenheit ? 'F' : 'C'}`;
        return { celsius, label, edge, position: `${((celsius - minimum) / (maximum - minimum)) * 100}%` };
      });
    },
    temperatureScaleCategories() {
      const minimum = TEMPERATURE_COLOR_STOPS[0][0];
      const maximum = TEMPERATURE_COLOR_STOPS[TEMPERATURE_COLOR_STOPS.length - 1][0];
      return [
        { label: 'Freezing', midpoint: -5 }, { label: 'Cold', midpoint: 5 },
        { label: 'Temperate', midpoint: 15 }, { label: 'Warm', midpoint: 25 },
        { label: 'Hot', midpoint: 35 }, { label: 'Scorching', midpoint: 42.5 },
      ].map((category, index, categories) => ({
        ...category,
        position: `${((category.midpoint - minimum) / (maximum - minimum)) * 100}%`,
        edge: index === 0 ? 'left-0' : index === categories.length - 1 ? '-translate-x-full' : '-translate-x-1/2',
      }));
    },
    highlightDetails() {
      const details = this.currentWeather?.details || {};
      const pick = (group, label) => details[group]?.[label] || '—';
      const valueOf = value => Number.parseFloat(String(value).replace(',', '.'));
      const percent = value => Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
      const humidity = valueOf(pick('atmosphere', 'Humidity'));
      const uv = valueOf(pick('environment', 'UV index'));
      const feels = valueOf(pick('atmosphere', 'Feels like'));
      const wind = valueOf(pick('wind', 'Speed'));
      const pressure = valueOf(pick('atmosphere', 'Pressure'));
      return [
        { label: 'UV index', value: pick('environment', 'UV index'), kind: 'uv', color: '#f59e0b', progress: percent(uv / 11 * 100) },
        { label: 'Humidity', value: pick('atmosphere', 'Humidity'), kind: 'humidity', color: '#0ea5e9', progress: percent(humidity) },
        { label: 'Feels like', value: pick('atmosphere', 'Feels like'), kind: 'feels', color: '#8b5cf6', progress: percent((feels + 10) / 55 * 100) },
        { label: 'Wind speed', value: pick('wind', 'Speed'), kind: 'wind', color: '#06b6d4', progress: percent(wind / 60 * 100) },
        { label: 'Sunrise · Sunset', value: `${pick('environment', 'Sunrise')} · ${pick('environment', 'Sunset')}`, kind: 'sunset', color: '#f97316', progress: 50 },
        { label: 'Pressure', value: pick('atmosphere', 'Pressure'), kind: 'pressure', color: '#3b82f6', progress: percent((pressure - 940) / 120 * 100) },
      ];
    },
    detailSections() {
      const progressFor = (label, value) => {
        const amount = Number.parseFloat(String(value).replace(',', '.'));
        if (!Number.isFinite(amount)) return null;
        if (/humidity|cloud cover|chance of rain/i.test(label)) return Math.max(0, Math.min(100, amount));
        if (/uv index/i.test(label)) return Math.max(0, Math.min(100, amount / 11 * 100));
        if (/air quality/i.test(label)) return Math.max(0, Math.min(100, amount / 5 * 100));
        if (/pressure/i.test(label)) return Math.max(0, Math.min(100, (amount - 940) / 120 * 100));
        if (/wind|gust/i.test(label)) return Math.max(0, Math.min(100, amount / 60 * 100));
        if (/visibility/i.test(label)) return Math.max(0, Math.min(100, amount / 40000 * 100));
        if (/rain|snow/i.test(label)) return Math.max(0, Math.min(100, amount / 20 * 100));
        if (/feels like|dew point/i.test(label)) return Math.max(0, Math.min(100, (amount + 10) / 55 * 100));
        return null;
      };
      const iconFor = (group, label) => {
        if (/visibility/i.test(label)) return 'eye';
        if (/air quality/i.test(label)) return 'leaf';
        if (/uv index/i.test(label)) return 'sun';
        if (/humidity|dew point|rain/i.test(label)) return 'drop';
        if (/cloud/i.test(label)) return 'cloud';
        if (/direction/i.test(label)) return 'compass';
        if (group === 'wind' || /wind|gust/i.test(label)) return 'wind';
        if (/snow/i.test(label)) return 'snow';
        if (/pressure/i.test(label)) return 'pressure';
        if (/feels like|temperature/i.test(label)) return 'temperature';
        return 'temperature';
      };
      const colors = { atmosphere: ['bg-violet-100 text-violet-700', 'bg-violet-500'], environment: ['bg-amber-100 text-amber-700', 'bg-amber-500'], wind: ['bg-cyan-100 text-cyan-700', 'bg-cyan-500'], rain: ['bg-sky-100 text-sky-700', 'bg-sky-500'], snow: ['bg-indigo-100 text-indigo-700', 'bg-indigo-500'] };
      return ['atmosphere', 'environment', 'wind', 'rain', 'snow'].map(group => {
        const entries = Object.entries(this.currentWeather?.details?.[group] || {});
        const items = entries.filter(([label]) => !/sunrise|sunset/i.test(label)).map(([label, value]) => ({ label, value, icon: iconFor(group, label), iconBg: colors[group][0], barColor: colors[group][1], progress: progressFor(label, value) }));
        const sunrise = entries.find(([label]) => label === 'Sunrise')?.[1];
        const sunset = entries.find(([label]) => label === 'Sunset')?.[1];
        if (sunrise || sunset) items.unshift({ label: 'Sunrise and sunset', kind: 'solar-times', progress: null, times: [{ label: 'Sunrise', value: sunrise || '—' }, { label: 'Sunset', value: sunset || '—' }] });
        return {
          title: ({ atmosphere: 'Atmosphere', environment: 'Environment', wind: 'Wind', rain: 'Rain', snow: 'Snow' })[group],
          items,
        };
      }).filter(section => section.items.length);
    },
  },
  watch: {
    getLocationConsent(decision) {
      if (decision !== 'denied' || this.weatherLocationSource !== 'browser') return;
      this.locationRequestId += 1;
      this.activeRequest += 1;
      this.currentWeather = null;
      this.fiveDayForecast = [];
      this.pageError = null;
      this.isLoading = false;
      this.showLocationConsent = true;
      this.activeRequest += 1;
    },
  },
  methods: {
    ...mapMutations(['setCurrentLocation', 'recordLocationConsent']),
    iconUrl(icon) { return `/img/weather-icons/${icon || 'clear/mostly-clear-day.svg'}`; },
    normalizeCityText(value) {
      return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
    },
    markLocationChoice() {
      markLocationChoiceForSession();
    },
    useHomeCityOnLaunch() {
      const home = this.getHomeCity;
      if (hasLocationChoiceBeenMadeThisSession() || !home || !Number.isFinite(home.latitude) || !Number.isFinite(home.longitude)) return false;
      const location = {
        ...home,
        name: cityDisplayName(home.name, home.state, home.country),
        source: 'city',
        last_updated: Date.now(),
        validity_duration: 365 * 24 * 60 * 60 * 1000,
      };
      this.setCurrentLocation(location);
      this.fetchWeather(location.latitude, location.longitude, location.name);
      return true;
    },
    countryName(countryCode) {
      try {
        return new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode) || countryCode;
      } catch (error) {
        return countryCode;
      }
    },
    searchCities() {
      const requestId = ++this.citySearchRequestId;
      window.clearTimeout(this.citySearchTimer);
      this.citySearchError = null;
      const query = this.normalizeCityText(this.cityQuery);
      this.citySearchResults = [];
      if (query.length < 2) {
        this.citySearchLoading = false;
        return;
      }
      this.citySearchLoading = true;
      this.citySearchTimer = window.setTimeout(async () => {
        try {
          const { results } = await searchCityDirectory(query, 12);
          if (requestId !== this.citySearchRequestId || query !== this.normalizeCityText(this.cityQuery)) return;
          this.citySearchResults = results;
          this.citySearchReady = true;
        } catch (error) {
          if (requestId === this.citySearchRequestId) this.citySearchError = error.message || 'Unable to load the city list.';
        } finally {
          if (requestId === this.citySearchRequestId) this.citySearchLoading = false;
        }
      }, 250);
    },
    selectCity(city) {
      const [name, state, country, latitude, longitude] = city;
      this.citySearchRequestId += 1;
      this.markLocationChoice();
      this.locationRequestId += 1;
      const location = {
        latitude, longitude, name, state, country, source: 'city',
        last_updated: Date.now(), validity_duration: 365 * 24 * 60 * 60 * 1000,
      };
      this.setCurrentLocation(location);
      this.cityQuery = '';
      this.citySearchResults = [];
      this.citySearchError = null;
      this.locationError = null;
      this.fetchWeather(latitude, longitude, cityDisplayName(name, state, country));
    },
    forecastIndex(day) { return this.forecastPositions[day.date] || 0; },
    forecastCardStyle(day, visibleIndex) {
      if (visibleIndex === 0) {
        const offset = this.swipeOffsets[day.date] || 0;
        return {
          zIndex: 3,
          transform: `translate(${offset}px, 0) rotate(${offset * 0.035}deg)`,
          transition: this.swipeAnimating[day.date] ? 'transform 220ms ease' : 'none',
        };
      }
      return {
        zIndex: 3 - visibleIndex,
        transform: `translateY(${visibleIndex * 10}px) scale(${1 - visibleIndex * 0.035})`,
      };
    },
    startForecastSwipe(event, day, visibleIndex) {
      if (visibleIndex !== 0 || this.swipeAnimating[day.date]) return;
      this.swipeStarts[day.date] = { x: event.clientX, pointerId: event.pointerId };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    moveForecastSwipe(event, day, visibleIndex) {
      const start = this.swipeStarts[day.date];
      if (visibleIndex !== 0 || !start || start.pointerId !== event.pointerId) return;
      this.swipeOffsets[day.date] = event.clientX - start.x;
    },
    finishForecastSwipe(event, day, visibleIndex) {
      const start = this.swipeStarts[day.date];
      if (visibleIndex !== 0 || !start || start.pointerId !== event.pointerId) return;
      const distance = event.clientX - start.x;
      delete this.swipeStarts[day.date];
      if (Math.abs(distance) < 90) {
        this.swipeAnimating[day.date] = true;
        this.swipeOffsets[day.date] = 0;
        window.setTimeout(() => { this.swipeAnimating[day.date] = false; }, 230);
        return;
      }
      this.swipeAnimating[day.date] = true;
      this.swipeOffsets[day.date] = Math.sign(distance) * Math.max(window.innerWidth, 420);
      window.setTimeout(() => {
        this.forecastPositions[day.date] = (this.forecastIndex(day) + 1) % day.forecasts.length;
        this.swipeOffsets[day.date] = 0;
        this.swipeAnimating[day.date] = false;
      }, 230);
    },
    cancelForecastSwipe(day) {
      delete this.swipeStarts[day.date];
      this.swipeAnimating[day.date] = true;
      this.swipeOffsets[day.date] = 0;
      window.setTimeout(() => { this.swipeAnimating[day.date] = false; }, 230);
    },
    advanceForecast(day) {
      this.forecastPositions[day.date] = (this.forecastIndex(day) + 1) % day.forecasts.length;
    },
    requestBrowserLocation() {
      if (!hasLocationConsent()) {
        this.showLocationConsent = true;
        this.isLoading = false;
        this.locationError = null;
        return;
      }
      const requestId = ++this.locationRequestId;
      this.markLocationChoice();
      this.showLocationConsent = false;
      this.locationError = null;
      if (!navigator.geolocation) {
        this.locationError = 'Your browser does not support location access. Allow location in a compatible browser to see local weather.';
        this.isLoading = false;
        return;
      }
      this.isLoading = true;
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          if (requestId !== this.locationRequestId) return;
          const location = { latitude: coords.latitude, longitude: coords.longitude, source: 'browser', last_updated: Date.now(), validity_duration: 3 * 60 * 1000 };
          this.setCurrentLocation(location);
          this.fetchWeather(location.latitude, location.longitude);
        },
        error => {
          if (requestId !== this.locationRequestId) return;
          this.locationError = error.code === 1
            ? 'Location permission was denied. Enable it in your browser settings, then try again.'
            : error.code === 3 ? 'The location request timed out. Please try again.' : 'We could not determine your location. Check your device settings and try again.';
          this.isLoading = false;
        },
        { enableHighAccuracy: false, timeout: 12000, maximumAge: 180000 },
      );
    },
    allowDeviceLocation() {
      saveConsent({ location: 'granted' });
      this.recordLocationConsent('granted');
      this.requestBrowserLocation();
    },
    declineDeviceLocation() {
      saveConsent({ location: 'denied' });
      this.recordLocationConsent('denied');
      this.showLocationConsent = false;
      this.isLoading = false;
    },
    refreshWeather() {
      const location = this.getCurrentLocation;
      if (location?.source === 'browser' && !hasLocationConsent()) {
        this.setCurrentLocation({});
      }
      const allowedLocation = location?.source === 'browser' && !hasLocationConsent() ? null : location;
      if (allowedLocation && Number.isFinite(allowedLocation.latitude) && Number.isFinite(allowedLocation.longitude)) {
        this.fetchWeather(allowedLocation.latitude, allowedLocation.longitude, allowedLocation.name || null);
      } else {
        this.requestBrowserLocation();
      }
    },
    async fetchWeather(latitude, longitude, displayCityName = null) {
      const requestId = ++this.activeRequest;
      this.isLoading = true;
      this.pageError = null;
      this.weatherLocationSource = displayCityName ? 'city' : 'browser';
      const apiKey = this.getOpwmKey;
      if (!apiKey) {
        this.pageError = 'Weather service is not configured. Add a VITE_OPWM_KEY value to the app environment.';
        this.isLoading = false;
        return;
      }
      try {
        const { current: weatherResult, forecast: forecastResult, uv: uvResult, air: airResult } = await fetchWeatherBundle(latitude, longitude, apiKey);
        if (requestId !== this.activeRequest) return;
        if (!weatherResult.success) throw new Error(weatherResult.message || 'Current conditions are unavailable.');
        this.currentWeather = makeFormattedCurrentWeatherData(weatherResult.data, uvResult.success ? uvResult.data : null, airResult.success ? airResult.data : null, this.getUnitSettings, displayCityName);
        if (forecastResult.success) {
          this.fiveDayForecast = makeFormattedWeatherForecastData(forecastResult.data, this.getUnitSettings);
          this.forecastPositions = {};
          this.swipeOffsets = {};
          this.swipeStarts = {};
          this.swipeAnimating = {};
        } else {
          this.fiveDayForecast = [];
        }
        if (!forecastResult.success) this.pageError = 'Current conditions loaded, but the forecast is temporarily unavailable.';
      } catch (error) {
        if (requestId === this.activeRequest) this.pageError = error.message || 'Please check your connection and try again.';
      } finally {
        if (requestId === this.activeRequest) this.isLoading = false;
      }
    },
  },
  mounted() {
    if (!this.useHomeCityOnLaunch()) this.refreshWeather();
  },
};
</script>
