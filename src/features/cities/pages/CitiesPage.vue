<template>
  <div class="mx-auto max-w-6xl space-y-8 py-4 sm:py-8">
    <header>
      <p class="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Make it yours</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Your cities</h1>
      <p class="mt-2 text-slate-600">Find a place, save the cities you care about, and switch your forecast any time.</p>
    </header>

    <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <label for="directory-search" class="block text-lg font-bold text-slate-900">Find a city</label>
      <p class="mt-1 text-sm text-slate-500">Search more than 200,000 cities by name, state, or country code.</p>
      <div class="relative mt-4">
        <input id="directory-search" v-model="query" type="search" autocomplete="off" placeholder="Try Mandalay, Paris, or Tokyo"
          class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
          @input="search" />
        <span v-if="loading" class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500" role="status">Searching…</span>
      </div>
      <p v-if="error" class="mt-3 text-sm text-rose-700" role="alert">{{ error }}</p>
      <p v-else-if="query.trim().length < 2" class="mt-3 text-sm text-slate-500">Enter at least two characters to search.</p>
      <div v-else-if="!loading && !error" class="mt-5">
        <p class="mb-3 text-sm text-slate-500">{{ totalResults.toLocaleString() }} matching {{ totalResults === 1 ? 'city' : 'cities' }} <span v-if="totalResults > results.length">· showing {{ results.length }}</span></p>
        <div v-if="results.length" class="grid gap-3 sm:grid-cols-2">
          <article v-for="city in results" :key="cityRecordId(city)" class="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-sky-200 hover:shadow-sm">
            <div class="min-w-0">
              <h2 class="truncate font-semibold text-slate-900">{{ city[0] }}<span v-if="isHome(city)" class="ml-2 rounded-full bg-sky-100 px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wide text-sky-800">Home</span></h2>
              <p class="mt-1 truncate text-sm text-slate-500">{{ city[1] ? `${city[1]}, ` : '' }}{{ countryName(city[2]) }}</p>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" :aria-label="`${isSaved(city) ? 'Remove' : 'Save'} ${city[0]} ${isSaved(city) ? 'from' : 'to'} saved cities`" @click="toggleSaved(city)">
                {{ isSaved(city) ? 'Saved' : 'Save' }}
              </button>
              <button type="button" class="rounded-lg border border-sky-200 px-3 py-2 text-sm font-semibold text-sky-800 transition hover:bg-sky-50 disabled:bg-sky-50 disabled:text-sky-800" :disabled="isHome(city)" @click="setAsHome(city)">{{ isHome(city) ? 'Home' : 'Set home' }}</button>
              <button type="button" class="rounded-lg bg-sky-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-800" :aria-label="`Show weather for ${city[0]}`" @click="useCity(city)">View</button>
            </div>
          </article>
        </div>
        <p v-else class="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No cities match that search. Try another spelling.</p>
        <button v-if="results.length < totalResults" type="button" class="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" @click="showMore">Show more results</button>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-end justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">Quick access</p>
          <h2 class="mt-1 text-2xl font-bold text-slate-900">Saved cities</h2>
        </div>
        <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{{ savedCities.length }}</span>
      </div>
      <div v-if="savedCities.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <article v-for="city in savedCities" :key="city.id" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h3 class="truncate font-bold text-slate-900">{{ city.name }}<span v-if="isHomeSaved(city)" class="ml-2 rounded-full bg-sky-100 px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wide text-sky-800">Home</span></h3>
              <p class="mt-1 truncate text-sm text-slate-500">{{ city.state ? `${city.state}, ` : '' }}{{ countryName(city.country) }}</p>
            </div>
            <button type="button" class="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-700" :aria-label="`Remove ${city.name} from saved cities`" @click="removeCity(city)">✕</button>
          </div>
          <div class="mt-4 flex gap-2">
            <button type="button" class="min-w-0 flex-1 rounded-xl bg-sky-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800" @click="useSavedCity(city)">Show forecast</button>
            <button type="button" class="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:border-sky-200 disabled:bg-sky-50 disabled:text-sky-800" :disabled="isHomeSaved(city)" @click="setAsHomeSaved(city)">{{ isHomeSaved(city) ? 'Home city' : 'Set as home' }}</button>
          </div>
        </article>
      </div>
      <div v-else class="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-5 py-10 text-center">
        <p class="font-semibold text-slate-800">No saved cities yet</p>
        <p class="mt-1 text-sm text-slate-500">Search for a city above and save it for quick access.</p>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { cityDisplayName, cityRecordId, searchCityDirectory } from '@/features/cities/services/city-directory';
import { markLocationChoiceForSession } from '@/shared/privacy/consent';

export default {
  name: 'CitiesPage',
  data() {
    return {
      query: '',
      results: [],
      totalResults: 0,
      resultLimit: 20,
      loading: false,
      error: null,
      timer: null,
      requestId: 0,
    };
  },
  computed: {
    ...mapGetters(['getSavedCities', 'getHomeCity']),
    savedCities() { return this.getSavedCities || []; },
    homeCity() { return this.getHomeCity || null; },
  },
  methods: {
    ...mapMutations(['saveCity', 'removeSavedCity', 'setCurrentLocation', 'setHomeCity', 'clearHomeCity']),
    cityRecordId,
    countryName(country) {
      try {
        return new Intl.DisplayNames(['en'], { type: 'region' }).of(country) || country;
      } catch {
        return country;
      }
    },
    isSaved(city) {
      const id = cityRecordId(city);
      return this.savedCities.some(saved => saved.id === id);
    },
    isHome(city) {
      return this.homeCity?.id === cityRecordId(city);
    },
    isHomeSaved(city) {
      return Boolean(this.homeCity && this.homeCity.id === city.id);
    },
    markLocationChoice() {
      markLocationChoiceForSession();
    },
    setAsHome(city) {
      const [name, state, country, latitude, longitude] = city;
      this.setAsHomeSaved({ id: cityRecordId(city), name, state, country, latitude, longitude });
    },
    setAsHomeSaved(city) {
      this.saveCity(city);
      this.setHomeCity(city);
      this.markLocationChoice();
      this.setCurrentLocation({
        ...city,
        name: cityDisplayName(city.name, city.state, city.country),
        source: 'city',
        last_updated: Date.now(),
        validity_duration: 365 * 24 * 60 * 60 * 1000,
      });
    },
    toggleSaved(city) {
      const id = cityRecordId(city);
      if (this.isSaved(city)) this.removeCity({ id });
      else {
        const [name, state, country, latitude, longitude] = city;
        this.saveCity({ id, name, state, country, latitude, longitude });
      }
    },
    removeCity(city) {
      this.removeSavedCity(city.id);
      if (this.homeCity?.id === city.id) this.clearHomeCity();
    },
    search() {
      const requestId = ++this.requestId;
      window.clearTimeout(this.timer);
      this.error = null;
      this.results = [];
      this.totalResults = 0;
      this.resultLimit = 20;
      if (this.query.trim().length < 2) {
        this.loading = false;
        return;
      }
      this.loading = true;
      this.timer = window.setTimeout(() => this.runSearch(requestId), 250);
    },
    async runSearch(requestId) {
      try {
        const { results, total } = await searchCityDirectory(this.query, this.resultLimit);
        if (requestId !== this.requestId) return;
        this.results = results;
        this.totalResults = total;
      } catch (error) {
        if (requestId === this.requestId) this.error = error.message || 'Unable to search the city list.';
      } finally {
        if (requestId === this.requestId) this.loading = false;
      }
    },
    showMore() {
      this.resultLimit += 20;
      const requestId = ++this.requestId;
      this.loading = true;
      this.runSearch(requestId);
    },
    useCity(city) {
      const [name, state, country, latitude, longitude] = city;
      this.activateCity({ name, state, country, latitude, longitude });
    },
    useSavedCity(city) {
      this.activateCity(city);
    },
    activateCity(city) {
      this.markLocationChoice();
      this.setCurrentLocation({
        latitude: city.latitude,
        longitude: city.longitude,
        name: cityDisplayName(city.name, city.state, city.country),
        state: city.state,
        country: city.country,
        source: 'city',
        last_updated: Date.now(),
        validity_duration: 365 * 24 * 60 * 60 * 1000,
      });
      this.$router.push({ name: 'HomePage' });
    },
  },
  beforeUnmount() {
    window.clearTimeout(this.timer);
    this.requestId += 1;
  },
};
</script>
