/**
 * Convert TypeScript scene files to JSON
 *
 * This script reads the TS scene arrays and outputs individual JSON scene files.
 * Run with: npx tsx scripts/convert-scenes-to-json.ts
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Import scene arrays
import { RONNIE_ACT1_SCENES } from '../src/content/routes/ronnie/act1.ts';
import { RONNIE_ACT2_SCENES } from '../src/content/routes/ronnie/act2.ts';
import { RONNIE_ACT3_SCENES } from '../src/content/routes/ronnie/act3.ts';
import { TORI_ACT1_SCENES } from '../src/content/routes/tori/act1.ts';
import { TORI_ACT2_SCENES } from '../src/content/routes/tori/act2.ts';
import { TORI_ACT3_SCENES } from '../src/content/routes/tori/act3.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SceneExport {
  route: string;
  act: number;
  scenes: Array<{ id: string; [key: string]: unknown }>;
}

const exports: SceneExport[] = [
  { route: 'ronnie', act: 1, scenes: RONNIE_ACT1_SCENES },
  { route: 'ronnie', act: 2, scenes: RONNIE_ACT2_SCENES },
  { route: 'ronnie', act: 3, scenes: RONNIE_ACT3_SCENES },
  { route: 'tori', act: 1, scenes: TORI_ACT1_SCENES },
  { route: 'tori', act: 2, scenes: TORI_ACT2_SCENES },
  { route: 'tori', act: 3, scenes: TORI_ACT3_SCENES },
];

const contentDir = join(__dirname, '../src/content/routes');

console.log('Converting TypeScript scenes to JSON...\n');

let totalScenes = 0;

for (const { route, act, scenes } of exports) {
  const outputDir = join(contentDir, route, `act${act}`);

  // Create directory if it doesn't exist
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log(`${route}/act${act}: ${scenes.length} scenes`);

  for (const scene of scenes) {
    const outputPath = join(outputDir, `${scene.id}.json`);
    const json = JSON.stringify(scene, null, 2);
    writeFileSync(outputPath, json, 'utf-8');
    totalScenes++;
  }
}

console.log(`\nDone! Converted ${totalScenes} scenes to JSON.`);
console.log('\nNext steps:');
console.log('1. Verify JSON files look correct');
console.log('2. Update RouteController to load from new paths');
console.log('3. Delete the old .ts scene files');
