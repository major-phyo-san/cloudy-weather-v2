import { calculateDewpoint } from './weather-calculations';
const DEFAULT_UNITS = { tempUnit: 'c', pressureUnit: 'hpa', visibilityUnit: 'm', windspeedUnit: 'ms' };
const isNumber = value => value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value));

const number = (value, digits = 0) => isNumber(value)
    ? String(Number(Number(value).toFixed(digits)))
    : '—';

function temperature(value, units) {
    if (!isNumber(value)) return '—';
    const converted = units.tempUnit === 'f' ? value * 9 / 5 + 32 : value;
    return `${number(converted, 1)} °${units.tempUnit === 'f' ? 'F' : 'C'}`;
}

function pressure(value, units) {
    if (!isNumber(value)) return '—';
    const conversions = { hpa: [1, 'hPa'], mbar: [1, 'mbar'], inhg: [0.0295299831, 'inHg'], mmhg: [0.750061683, 'mmHg'], psi: [0.0145037738, 'PSI'] };
    const [factor, suffix] = conversions[units.pressureUnit] || conversions.hpa;
    return `${number(value * factor, 2)} ${suffix}`;
}

function visibility(value, units) {
    if (!isNumber(value)) return '—';
    const conversions = { m: [1, 'm'], km: [0.001, 'km'], ft: [3.28084, 'ft'], mi: [0.000621371, 'mi'] };
    const [factor, suffix] = conversions[units.visibilityUnit] || conversions.m;
    return `${number(value * factor, 2)} ${suffix}`;
}

function windSpeed(value, units) {
    if (!isNumber(value)) return '—';
    const conversions = { ms: [1, 'm/s'], kmh: [3.6, 'km/h'], mph: [2.23694, 'mph'], knots: [1.94384, 'knots'] };
    if (units.windspeedUnit === 'beau') {
        const thresholds = [0.3, 1.6, 3.4, 5.5, 8, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7];
        return `Beaufort ${thresholds.findIndex(threshold => value < threshold) < 0 ? 12 : thresholds.findIndex(threshold => value < threshold)}`;
    }
    const [factor, suffix] = conversions[units.windspeedUnit] || conversions.ms;
    return `${number(value * factor, 1)} ${suffix}`;
}

function directionText(degrees = 0) {
    const points = ['North', 'North East', 'East', 'South East', 'South', 'South West', 'West', 'North West'];
    return points[Math.round((((Number(degrees) % 360) + 360) % 360) / 45) % 8];
}

function directionIcon(direction) {
    return `wind-directions/wind-${direction.toLowerCase().replace(' ', '-')}.svg`;
}

function dayOrNight(timestamp) {
    const hour = new Date(timestamp).getUTCHours();
    return hour >= 6 && hour < 18 ? 'day' : 'night';
}

function weatherIcon(timestamp, code, clouds = 0) {
    const phase = dayOrNight(timestamp);
    if (code >= 200 && code <= 232) return code < 230 ? 'thunderstorm/thunderstorm.svg' : `thunderstorm/isolated-scattered-tstorms-${phase}.svg`;
    if (code >= 300 && code <= 321) return code === 312 || code === 321 ? 'drizzle/drizzle-heavy.svg' : 'drizzle/drizzle-rain.svg';
    if (code >= 500 && code <= 531) return code === 511 ? 'rain/freezing-rain.svg' : code >= 502 ? 'rain/heavy-rain.svg' : code >= 520 ? `rain/showers-${phase}.svg` : 'rain/light-rain.svg';
    if (code >= 600 && code <= 622) return code === 602 ? 'snow/heavy-snow.svg' : code >= 611 && code <= 613 ? 'snow/sleet.svg' : code >= 615 ? 'snow/rain-snow.svg' : 'snow/snow.svg';
    if (code >= 701 && code <= 781) return ({ 701: 'misc/mist.svg', 711: 'misc/smoke.svg', 721: 'misc/haze.svg', 731: 'misc/whirl.svg', 741: 'misc/fog.svg', 751: 'misc/whirl.svg', 761: 'misc/dust.svg', 762: 'misc/volcano.svg', 771: 'misc/mist.svg', 781: `misc/tornado-${phase}.svg` })[code] || 'misc/mist.svg';
    if (code === 800) return `clear/clear-${phase}.svg`;
    if (code === 801) return `clear/mostly-clear-${phase}.svg`;
    if (code === 802) return `cloudy/partly-cloudy-${phase}.svg`;
    if (code === 803) return `cloudy/mostly-cloudy-${phase}-1.svg`;
    if (code === 804) return clouds > 60 ? 'cloudy/overcast-clouds-3.svg' : 'cloudy/overcast-clouds-2.svg';
    return `clear/mostly-clear-${phase}.svg`;
}

function feelsLikeIcon(value) {
    return value <= 20 ? 'measurements/temp-cold.svg' : value <= 34 ? 'measurements/temp-moderate.svg' : 'measurements/temp-hot.svg';
}

function timestampWithOffset(unixSeconds, offsetSeconds = 0) {
    return new Date((Number(unixSeconds) + Number(offsetSeconds || 0)) * 1000);
}

function localTime(unixSeconds, offsetSeconds = 0) {
    if (!isNumber(unixSeconds)) return null;
    return timestampWithOffset(unixSeconds, offsetSeconds).toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', timeZone: 'UTC',
    });
}

function dateKey(unixSeconds, offsetSeconds) {
    return timestampWithOffset(unixSeconds, offsetSeconds).toISOString().slice(0, 10);
}

function friendlyDate(dateKeyValue) {
    return new Date(`${dateKeyValue}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: '2-digit', weekday: 'long', timeZone: 'UTC' });
}

function friendlyDateTime(date) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit', timeZone: 'UTC',
    }).format(date);
}

function aqiText(aqi) {
    return ({ 1: '1 · Good', 2: '2 · Fair', 3: '3 · Moderate', 4: '4 · Poor', 5: '5 · Very poor' })[aqi] || 'Unavailable';
}

function formattedDetails(weather, units, includeEnvironment = false, aqi = null, uv = null) {
    const main = weather.main || {};
    const wind = weather.wind || {};
    const clouds = weather.clouds || {};
    const details = {
        atmosphere: {
            'Feels like': temperature(main.feels_like, units),
            Humidity: `${number(main.humidity)}%`,
            'Dew point': temperature(calculateDewpoint(main.temp, main.humidity), units),
            'Cloud cover': `${number(clouds.all)}%`,
            Pressure: pressure(main.pressure, units),
        },
        wind: { Speed: windSpeed(wind.speed, units), Direction: directionText(wind.deg) },
    };
    if (isNumber(wind.gust)) details.wind.Gust = windSpeed(wind.gust, units);
    if (includeEnvironment) {
        details.environment = { Visibility: visibility(weather.visibility, units) };
        const timezoneOffset = weather.timezone || 0;
        const sunrise = localTime(weather.sys?.sunrise, timezoneOffset);
        const sunset = localTime(weather.sys?.sunset, timezoneOffset);
        if (sunrise) details.environment.Sunrise = sunrise;
        if (sunset) details.environment.Sunset = sunset;
        details.environment['Air quality'] = aqiText(aqi);
        if (isNumber(uv)) details.environment['UV index'] = number(uv, 1);
    }
    if (weather.rain) details.rain = Object.fromEntries(Object.entries(weather.rain).map(([period, amount]) => [`${period} rain`, `${number(amount, 1)} mm`]).filter(([, amount]) => amount !== '— mm'));
    if (weather.snow) details.snow = Object.fromEntries(Object.entries(weather.snow).map(([period, amount]) => [`${period} snow`, `${number(amount, 1)} mm`]).filter(([, amount]) => amount !== '— mm'));
    return details;
}

export function makeFormattedCurrentWeatherData(weather, uvData = null, airData = null, formatSettings = null, displayCityName = null) {
    if (!weather || !weather.main || !weather.weather?.[0]) throw new Error('Current weather response is incomplete.');
    const units = { ...DEFAULT_UNITS, ...(formatSettings || {}) };
    const offset = weather.timezone || 0;
    const condition = weather.weather[0];
    const aqi = airData?.list?.[0]?.main?.aqi;
    const uv = uvData?.value;
    const result = {
        city: displayCityName || weather.name || 'Your location',
        temperature_c: Number(weather.main.temp),
        temperature: temperature(weather.main.temp, units),
        temp_min: temperature(weather.main.temp_min, units),
        temp_max: temperature(weather.main.temp_max, units),
        main: condition.main || 'Weather',
        description: condition.description || 'Current conditions',
        feels_like: temperature(weather.main.feels_like, units),
        timestamp: isNumber(weather.dt) ? Number(weather.dt) : null,
        time: localTime(weather.dt, offset),
        updated_on: friendlyDateTime(timestampWithOffset(weather.dt, offset)),
        sunrise_timestamp: isNumber(weather.sys?.sunrise) ? Number(weather.sys.sunrise) : null,
        sunset_timestamp: isNumber(weather.sys?.sunset) ? Number(weather.sys.sunset) : null,
        details: formattedDetails(weather, units, true, aqi, uv),
        main_icon: weatherIcon((Number(weather.dt) + offset) * 1000, condition.id, weather.clouds?.all),
        feels_like_icon: feelsLikeIcon(weather.main.feels_like),
        wind_direction_icon: directionIcon(directionText(weather.wind?.deg)),
        wind_gust_icon: `measurements/wind-${dayOrNight((Number(weather.dt) + offset) * 1000)}.svg`,
    };
    return result;
}

export function makeFormattedWeatherForecastData(forecastData, formatSettings = null) {
    if (!Array.isArray(forecastData?.list)) throw new Error('Forecast response is incomplete.');
    const units = { ...DEFAULT_UNITS, ...(formatSettings || {}) };
    const offset = forecastData.city?.timezone || 0;
    const days = new Map();
    forecastData.list.forEach(item => {
        const key = dateKey(item.dt, offset);
        if (!days.has(key)) days.set(key, []);
        const localTimestamp = (Number(item.dt) + offset) * 1000;
        const condition = item.weather?.[0] || {};
        const direction = directionText(item.wind?.deg);
        const details = formattedDetails(item, units).atmosphere;
        details.Visibility = visibility(item.visibility, units);
        details['Wind speed'] = windSpeed(item.wind?.speed, units);
        if (isNumber(item.pop)) details['Chance of rain'] = `${number(item.pop * 100)}%`;
        if (item.rain) Object.entries(item.rain).forEach(([period, amount]) => { details[`${period} rain`] = `${number(amount, 1)} mm`; });
        if (item.snow) Object.entries(item.snow).forEach(([period, amount]) => { details[`${period} snow`] = `${number(amount, 1)} mm`; });
        days.get(key).push({
            time: new Date(localTimestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }),
            timestamp: Number(item.dt),
            main_text: condition.main || 'Weather', description: condition.description || '',
            temperature: temperature(item.main?.temp, units), details,
            temperature_c: isNumber(item.main?.temp) ? Number(item.main.temp) : null,
            low: temperature(item.main?.temp_min, units),
            high: temperature(item.main?.temp_max, units),
            temperature_min_c: isNumber(item.main?.temp_min) ? Number(item.main.temp_min) : null,
            temperature_max_c: isNumber(item.main?.temp_max) ? Number(item.main.temp_max) : null,
            main_icon: weatherIcon(localTimestamp, condition.id, item.clouds?.all),
            feels_like_icon: feelsLikeIcon(item.main?.feels_like),
            wind_direction_icon: directionIcon(direction),
            wind_gust_icon: `measurements/wind-${dayOrNight(localTimestamp)}.svg`,
        });
    });
    return [...days.entries()].map(([key, forecasts], index) => {
        const lows = forecasts.map(item => item.temperature_min_c).filter(isNumber);
        const highs = forecasts.map(item => item.temperature_max_c).filter(isNumber);
        return {
            date: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : friendlyDate(key),
            low: lows.length ? temperature(Math.min(...lows), units) : '—',
            high: highs.length ? temperature(Math.max(...highs), units) : '—',
            forecasts,
        };
    });
}
