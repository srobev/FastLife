// Seed script to load content into DB
const fs = require('fs');
const path = require('path');

// Placeholder: Load cities, routes, jobs JSON and insert via Drizzle
console.log('Seeding content...');

// Example: Read from packages/server/src/data/seeds/cities.json
const citiesPath = path.join(__dirname, '../../packages/server/src/data/seeds/cities.json');
if (fs.existsSync(citiesPath)) {
  const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
  console.log(`Loaded ${cities.length} cities`);
  // TODO: Insert with db.insert(citiesTable).values(cities)
} else {
  console.log('Cities seed file not found');
}

console.log('Seeding complete.');
