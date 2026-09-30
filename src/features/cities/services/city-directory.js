let cityIndexPromise = null;

function normalize(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
}

export function loadCityIndex() {
  if (!cityIndexPromise) {
    cityIndexPromise = fetch(`${import.meta.env.BASE_URL}data/cities.min.json`)
      .then(response => {
        if (!response.ok) throw new Error('The city list could not be loaded.');
        return response.json();
      })
      .then(records => {
        if (!Array.isArray(records)) throw new Error('The city list has an invalid format.');
        return records;
      })
      .catch(error => {
        cityIndexPromise = null;
        throw error;
      });
  }
  return cityIndexPromise;
}

export async function searchCityDirectory(query, limit = 12) {
  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 2) return { results: [], total: 0 };

  const records = await loadCityIndex();
  const matches = [];
  let total = 0;
  records.forEach(city => {
    const name = normalize(city[0]);
    const state = normalize(city[1]);
    const country = normalize(city[2]);
    if (!name.includes(normalizedQuery) && !state.includes(normalizedQuery) && !country.includes(normalizedQuery)) return;
    total += 1;
    const rank = name.startsWith(normalizedQuery) ? 0 : state.startsWith(normalizedQuery) ? 1 : country === normalizedQuery ? 2 : 3;
    matches.push({ city, rank });
    if (matches.length > limit * 3) {
      matches.sort((left, right) => left.rank - right.rank || left.city[0].localeCompare(right.city[0]));
      matches.length = limit * 2;
    }
  });
  matches.sort((left, right) => left.rank - right.rank || left.city[0].localeCompare(right.city[0]));
  return { results: matches.slice(0, limit).map(match => match.city), total };
}

export function cityRecordId(city) {
  return `${city[0]}|${city[1]}|${city[2]}|${city[3]}|${city[4]}`;
}

export function cityDisplayName(name, state, countryCode) {
  let country = countryCode;
  try {
    country = new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode) || countryCode;
  } catch {
    // Fall back to the provided country code in browsers without region names.
  }
  return state ? `${name}, ${state}, ${country}` : `${name}, ${country}`;
}
