/**
 * V1 → V2 Content Migration Script
 * 
 * Converts V1 route classes (ToriAct1, RonnieAct1, etc.) to V2 JSON format
 * 
 * Strategy:
 * 1. Parse V1 JS files
 * 2. Extract scene methods (scene1_coffee, scene2_awakening, etc.)
 * 3. Convert displayScene() calls to Scene JSON
 * 4. Handle edge cases (conditionals, dynamic content)
 * 5. Output JSON files
 * 
 * Usage:
 *   npm run migrate -- --route tori --act 1
 *   npm run migrate -- --all
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { Scene, Route } from './scene-schema-example';

interface MigrationOptions {
  /** Route to migrate: 'ronnie' | 'tori' | 'all' */
  route?: 'ronnie' | 'tori' | 'all';
  
  /** Act number: 1 | 2 | 3 */
  act?: number;
  
  /** Output directory */
  output?: string;
  
  /** Dry run (don't write files) */
  dryRun?: boolean;
}

/**
 * Main Migration Function
 */
export async function migrateContent(options: MigrationOptions) {
  const {
    route = 'all',
    act,
    output = 'src/content/routes',
    dryRun = false
  } = options;

  console.log(`🔄 Starting V1 → V2 migration...`);
  console.log(`   Route: ${route}`);
  console.log(`   Act: ${act || 'all'}`);
  console.log(`   Output: ${output}`);
  console.log(`   Dry run: ${dryRun}\n`);

  // Find V1 route files
  const v1Routes = findV1RouteFiles(route, act);
  
  for (const v1File of v1Routes) {
    console.log(`📖 Parsing: ${v1File.name}`);
    
    // Read and parse V1 file
    const content = fs.readFileSync(v1File.path, 'utf-8');
    const scenes = extractScenesFromV1(content);
    
    // Convert to V2 format
    const v2Route = convertToV2Format(v1File, scenes);
    
    // Validate against schema
    const validation = validateRoute(v2Route);
    if (!validation.valid) {
      console.error(`❌ Validation failed for ${v1File.name}:`);
      validation.errors.forEach(err => console.error(`   - ${err}`));
      continue;
    }
    
    // Write JSON file
    if (!dryRun) {
      const outputPath = path.join(
        output,
        v1File.route,
        `act${v1File.act}.json`
      );
      
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(
        outputPath,
        JSON.stringify(v2Route, null, 2),
        'utf-8'
      );
      
      console.log(`✅ Created: ${outputPath}`);
    } else {
      console.log(`✅ Would create: ${output}/${v1File.route}/act${v1File.act}.json`);
    }
  }
  
  console.log(`\n✨ Migration complete!`);
}

/**
 * Find V1 route files to migrate
 */
function findV1RouteFiles(
  route: string,
  act?: number
): Array<{ name: string; path: string; route: string; act: number }> {
  const routesDir = path.join(__dirname, '../routes');
  const files: Array<{ name: string; path: string; route: string; act: number }> = [];
  
  const patterns = [
    route === 'ronnie' || route === 'all' 
      ? ['ronnie-route-act1.js', 'ronnie-route-act2.js', 'ronnie-route-act3.js']
      : [],
    route === 'tori' || route === 'all'
      ? ['tori-route-act1.js', 'tori-route-act2.js', 'tori-route-act3.js']
      : []
  ].flat();
  
  for (const pattern of patterns) {
    if (act) {
      const actNum = parseInt(pattern.match(/act(\d)/)?.[1] || '0');
      if (actNum !== act) continue;
    }
    
    const filePath = path.join(routesDir, pattern);
    if (fs.existsSync(filePath)) {
      const routeName = pattern.includes('ronnie') ? 'ronnie' : 'tori';
      const actNum = parseInt(pattern.match(/act(\d)/)?.[1] || '0');
      
      files.push({
        name: pattern,
        path: filePath,
        route: routeName,
        act: actNum
      });
    }
  }
  
  return files;
}

/**
 * Extract scenes from V1 JavaScript file
 * 
 * Looks for methods like:
 *   scene1_coffee() {
 *     this.game.displayScene({ ... }, 'scene1_coffee');
 *   }
 */
function extractScenesFromV1(content: string): Scene[] {
  const ast = parse(content, {
    sourceType: 'module',
    plugins: ['typescript', 'classProperties']
  });
  
  const scenes: Scene[] = [];
  
  traverse(ast, {
    ClassMethod(path) {
      // Look for scene methods (scene1_*, scene2_*, etc.)
      const methodName = path.node.key;
      if (
        typeof methodName === 'object' &&
        'name' in methodName &&
        methodName.name.match(/^scene\d+_/)
      ) {
        // Extract displayScene() call arguments
        const sceneData = extractDisplaySceneCall(path.node);
        if (sceneData) {
          scenes.push({
            ...sceneData,
            id: methodName.name as string
          });
        }
      }
    }
  });
  
  return scenes;
}

/**
 * Extract displayScene() call arguments
 * 
 * Converts:
 *   this.game.displayScene({ character, dialogue, next: () => ... }, 'id')
 * 
 * To:
 *   { character, dialogue, next: 'scene_id' }
 */
function extractDisplaySceneCall(method: any): Partial<Scene> | null {
  // TODO: Implement Babel traversal to find displayScene() call
  // Extract first argument object properties
  // Convert arrow functions in 'next' to string scene IDs
  
  // This is a placeholder - actual implementation requires:
  // 1. Finding the CallExpression for displayScene
  // 2. Extracting object properties
  // 3. Converting function references to string IDs
  // 4. Handling edge cases (conditionals, dynamic values)
  
  return null; // Placeholder
}

/**
 * Convert extracted scenes to V2 Route format
 */
function convertToV2Format(
  v1File: { name: string; route: string; act: number },
  scenes: Scene[]
): Route {
  return {
    id: v1File.route as 'ronnie' | 'tori',
    name: v1File.route === 'ronnie' ? 'Ronnie' : 'Tori',
    description: `${v1File.route} Act ${v1File.act}`,
    startScene: scenes[0]?.id || '',
    scenes: scenes
  };
}

/**
 * Validate route against schema
 */
function validateRoute(route: Route): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Basic validation
  if (!route.id) errors.push('Missing route id');
  if (!route.startScene) errors.push('Missing startScene');
  if (!route.scenes || route.scenes.length === 0) {
    errors.push('No scenes found');
  }
  
  // Validate each scene
  route.scenes?.forEach((scene, index) => {
    if (!scene.id) {
      errors.push(`Scene ${index}: Missing id`);
    }
    if (!scene.dialogue) {
      errors.push(`Scene ${index} (${scene.id}): Missing dialogue`);
    }
    
    // Validate next references exist
    if (typeof scene.next === 'string') {
      const nextExists = route.scenes.some(s => s.id === scene.next);
      if (!nextExists) {
        errors.push(`Scene ${scene.id}: next scene '${scene.next}' not found`);
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  const options: MigrationOptions = {
    route: args.includes('--all') ? 'all' : 
           args.includes('--ronnie') ? 'ronnie' :
           args.includes('--tori') ? 'tori' : 'all',
    act: args.find(a => a.startsWith('--act='))?.split('=')[1] as number | undefined,
    dryRun: args.includes('--dry-run')
  };
  
  migrateContent(options).catch(console.error);
}
