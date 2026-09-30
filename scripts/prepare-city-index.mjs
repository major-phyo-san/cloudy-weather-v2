import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = resolve(projectRoot, 'data/openweathermap/city.list.min.json');
const outputPath = resolve(projectRoot, 'public/data/cities.min.json');

const source = JSON.parse(await readFile(sourcePath, 'utf8'));
if (!Array.isArray(source)) throw new Error('OpenWeatherMap city list must be a JSON array.');

const cities = source
  .filter(city => city?.name && city?.country && Number.isFinite(city?.coord?.lat) && Number.isFinite(city?.coord?.lon))
  .map(city => [city.name, city.state || '', city.country, city.coord.lat, city.coord.lon]);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(cities));
console.log(`Prepared ${cities.length.toLocaleString()} cities for search.`);
