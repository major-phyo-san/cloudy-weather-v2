# cloudy-weather-v2

## Project setup
```
yarn install
```

### Run the development server
```
yarn dev
```

### Compiles and minifies for production
```
yarn build
```

### City search data

Keep the OpenWeatherMap source list at `data/openweathermap/city.list.min.json`. The `predev` and `prebuild` scripts generate a compact search index in `public/data/cities.min.json`; the app downloads that index only when a city search is started. Do not edit the generated index directly.

## Source layout

- `src/app/` contains app bootstrap, routing, layouts, and the Vuex store.
- `src/features/` groups screens and domain logic by weather, cities, and settings.
- `src/shared/` contains reusable API, utility, and UI modules.
- `src/assets/` contains app-wide static assets and styles.

Pages should depend on their feature services and shared modules; shared modules should not depend on feature pages.
