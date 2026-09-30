import { getApiData } from '@/shared/api/http-client';

const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

export function fetchWeatherBundle(latitude, longitude, apiKey) {
  const query = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    appid: String(apiKey),
  });
  const queryString = query.toString();

  return Promise.all([
    getApiData({ url: `${WEATHER_API_BASE}/weather?${queryString}&units=metric` }),
    getApiData({ url: `${WEATHER_API_BASE}/forecast?${queryString}&units=metric` }),
    getApiData({ url: `${WEATHER_API_BASE}/uvi?${queryString}` }),
    getApiData({ url: `${WEATHER_API_BASE}/air_pollution?${queryString}` }),
  ]).then(([current, forecast, uv, air]) => ({ current, forecast, uv, air }));
}
