<template>
  <article v-if="points.length > 1" class="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">Temperature trend</p>
        <h2 class="mt-1 text-xl font-bold text-slate-900">Next 24 hours</h2>
      </div>
      <div class="flex items-center gap-4 text-xs font-medium text-slate-500">
        <span v-if="markers.some(marker => marker.kind === 'sunrise')" class="inline-flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-amber-400"></span>Sunrise</span>
        <span v-if="markers.some(marker => marker.kind === 'sunset')" class="inline-flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-orange-500"></span>Sunset</span>
      </div>
    </header>

    <div class="mt-5 overflow-x-auto">
      <svg viewBox="0 0 760 300" class="h-auto min-w-[620px] w-full" role="img" aria-label="Temperature graph for the next 24 hours">
        <defs>
          <linearGradient id="temperature-area-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.24" />
            <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.015" />
          </linearGradient>
        </defs>

        <g v-for="tick in yTicks" :key="tick.value">
          <line x1="78" :y1="tick.y" x2="738" :y2="tick.y" stroke="#e2e8f0" stroke-dasharray="3 5" />
          <text x="68" :y="tick.y + 4" text-anchor="end" fill="#64748b" font-size="11">{{ tick.label }}</text>
        </g>

        <g v-for="marker in markers" :key="marker.kind">
          <line :x1="marker.x" y1="30" :x2="marker.x" y2="202" :stroke="marker.color" stroke-dasharray="4 5" stroke-opacity="0.75" />
          <circle :cx="marker.x" cy="30" r="4" :fill="marker.color" />
          <text :x="marker.x" y="19" text-anchor="middle" :fill="marker.color" font-size="10" font-weight="600">{{ marker.label }}</text>
        </g>

        <path :d="areaPath" fill="url(#temperature-area-fill)" />
        <path :d="linePath" fill="none" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

        <g v-for="(point, index) in points" :key="point.timestamp">
          <text :x="point.temperatureLabelX" :y="point.temperatureLabelY" :text-anchor="point.temperatureAnchor" fill="#0f172a" font-size="11" font-weight="700">{{ point.temperature }}</text>
          <circle :cx="point.x" :cy="point.y" r="5" fill="white" stroke="#0284c7" stroke-width="3">
            <title>{{ point.time }} · {{ point.temperature }}</title>
          </circle>
          <template v-if="point.showTime">
            <image :href="iconUrl(point.icon)" :x="point.x - 11" y="218" width="22" height="22" />
            <text :x="point.x" y="264" text-anchor="middle" fill="#64748b" font-size="10">{{ point.time }}</text>
          </template>
        </g>
      </svg>
    </div>
  </article>
</template>

<script>
const PLOT = { left: 86, right: 730, top: 40, bottom: 195 };

export default {
  name: 'TemperatureChart',
  props: {
    forecastDays: { type: Array, default: () => [] },
    currentConditions: { type: Object, default: null },
    sunrise: { type: Number, default: null },
    sunset: { type: Number, default: null },
    temperatureUnit: { type: String, default: 'c' },
  },
  computed: {
    series() {
      const forecast = this.forecastDays.flatMap(day => day.forecasts || []);
      const current = this.currentConditions;
      if (!Number.isFinite(current?.timestamp) || !Number.isFinite(current?.temperature_c)) {
        return forecast.slice(0, 9).filter(item => Number.isFinite(item.timestamp) && Number.isFinite(item.temperature_c));
      }
      const endOfWindow = current.timestamp + 24 * 60 * 60;
      const upcoming = forecast.filter(item => item.timestamp > current.timestamp && item.timestamp <= endOfWindow)
        .slice(0, 8);
      return [{
        timestamp: current.timestamp,
        temperature_c: current.temperature_c,
        time: 'Now',
        main_icon: current.main_icon,
      }, ...upcoming];
    },
    displayTemperatures() {
      return this.series.map(item => this.temperatureUnit === 'f' ? item.temperature_c * 9 / 5 + 32 : item.temperature_c);
    },
    bounds() {
      if (!this.displayTemperatures.length) return { min: 0, max: 1 };
      const low = Math.min(...this.displayTemperatures);
      const high = Math.max(...this.displayTemperatures);
      const min = Math.floor((low - 2) / 2) * 2;
      const max = Math.ceil((high + 2) / 2) * 2;
      return { min, max: max === min ? min + 2 : max };
    },
    points() {
      const first = this.series[0]?.timestamp;
      const last = this.series[this.series.length - 1]?.timestamp;
      const timeSpan = last - first || 1;
      const valueSpan = this.bounds.max - this.bounds.min || 1;
      const points = this.series.map((item, index) => {
        const value = this.displayTemperatures[index];
        const x = PLOT.left + (item.timestamp - first) / timeSpan * (PLOT.right - PLOT.left);
        const y = PLOT.bottom - (value - this.bounds.min) / valueSpan * (PLOT.bottom - PLOT.top);
        return {
          timestamp: item.timestamp,
          x,
          y,
          temperature: `${Math.round(value * 10) / 10} °${this.temperatureUnit === 'f' ? 'F' : 'C'}`,
          time: item.time,
          icon: item.main_icon,
        };
      });
      let lastTimeLabelX = -Infinity;
      return points.map((point, index) => {
        const showTime = index === 0 || point.x - lastTimeLabelX >= 76;
        if (showTime) lastTimeLabelX = point.x;
        return {
          ...point,
          showTime,
          temperatureLabelX: index === 0 ? point.x + 12 : index === points.length - 1 ? point.x - 12 : point.x,
          temperatureAnchor: index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle',
          temperatureLabelY: point.y + (index % 2 === 0 ? -14 : 24),
        };
      });
    },
    linePath() {
      if (!this.points.length) return '';
      return this.points.reduce((path, point, index, points) => {
        if (index === 0) return `M ${point.x} ${point.y}`;
        const previous = points[index - 1];
        const middleX = (previous.x + point.x) / 2;
        return `${path} Q ${previous.x} ${previous.y} ${middleX} ${(previous.y + point.y) / 2}`;
      }, '') + ` L ${this.points[this.points.length - 1].x} ${this.points[this.points.length - 1].y}`;
    },
    areaPath() {
      if (!this.points.length) return '';
      const first = this.points[0];
      const last = this.points[this.points.length - 1];
      return `${this.linePath} L ${last.x} ${PLOT.bottom} L ${first.x} ${PLOT.bottom} Z`;
    },
    yTicks() {
      return Array.from({ length: 4 }, (_, index) => {
        const amount = index / 3;
        const value = this.bounds.max - amount * (this.bounds.max - this.bounds.min);
        return {
          value,
          y: PLOT.top + amount * (PLOT.bottom - PLOT.top),
          label: `${Math.round(value)}°${this.temperatureUnit === 'f' ? 'F' : 'C'}`,
        };
      });
    },
    markers() {
      if (this.series.length < 2) return [];
      const first = this.series[0].timestamp;
      const last = this.series[this.series.length - 1].timestamp;
      return [
        { kind: 'sunrise', label: 'Sunrise', timestamp: this.sunrise, color: '#f59e0b' },
        { kind: 'sunset', label: 'Sunset', timestamp: this.sunset, color: '#f97316' },
      ].filter(marker => Number.isFinite(marker.timestamp) && marker.timestamp >= first && marker.timestamp <= last)
        .map(marker => ({ ...marker, x: PLOT.left + (marker.timestamp - first) / (last - first) * (PLOT.right - PLOT.left) }));
    },
  },
  methods: {
    iconUrl(icon) { return `/img/weather-icons/${icon || 'clear/mostly-clear-day.svg'}`; },
  },
};
</script>
