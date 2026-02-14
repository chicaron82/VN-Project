/// <reference types="vitest" />
import fs from 'fs';
import path from 'path';
import prologueData from '../../content/routes/prologue.json';
import ronnieData from '../../content/routes/ronnie.json';
import toriAct1Data from '../../content/routes/tori_act1.json';
import toriAct2Data from '../../content/routes/tori_act2.json';
import toriAct3Data from '../../content/routes/tori_act3.json';
import toriEndingsData from '../../content/routes/tori_endings.json';
import ronnieAct2Data from '../../content/routes/ronnie_act2.json';
import ronnieAct3Data from '../../content/routes/ronnie_act3.json';
import ronnieEndingsData from '../../content/routes/ronnie_endings.json';
import epilogueData from '../../content/routes/epilogue.json';
import ronnieAct1Data from '../../content/routes/ronnie_act1.json';

const ROUTES = {
    prologue: prologueData,
    ronnie: ronnieData,
    ronnie_act1: ronnieAct1Data,
    ronnie_act2: ronnieAct2Data,
    ronnie_act3: ronnieAct3Data,
    ronnie_endings: ronnieEndingsData,
    tori_act1: toriAct1Data,
    tori_act2: toriAct2Data,
    tori_act3: toriAct3Data,
    tori_endings: toriEndingsData,
    epilogue: epilogueData
};
const ASSETS_ROOT = path.resolve(__dirname, '../../../assets');

describe('Content Verification', () => {

    // Helper to check asset existence
    function verifyAsset(assetPath: string) {
        // Remove '../assets/' prefix if present, as ASSETS_ROOT is the assets folder
        const cleanPath = assetPath.replace(/^assets\//, '');
        const fullPath = path.join(ASSETS_ROOT, cleanPath);

        const exists = fs.existsSync(fullPath);
        if (!exists) {
            console.warn(`⚠️ Asset missing: ${assetPath} (looked at ${fullPath})`);
        }
        return exists;
    }

    // Helper to verify assets for a given route
    function verifyRouteAssets(route: any) {
        route.scenes.forEach((scene: any) => {
            if (scene.background) {
                try {
                    expect(verifyAsset(scene.background)).toBe(true);
                } catch (e) {
                    console.warn(`Missing background in ${route.id || 'unknown_route'}:${scene.id}: ${scene.background}`);
                    throw e;
                }
            }
            if (scene.sprites) {
                Object.entries(scene.sprites).forEach(([key, spritePath]) => {
                    if (key === 'highlight') return; // Skip highlight config
                    if (typeof spritePath === 'string' && spritePath !== 'echoes' && !spritePath.includes('placeholder') && spritePath !== 'null') {
                        try {
                            expect(verifyAsset(spritePath)).toBe(true);
                        } catch (e) {
                            console.warn(`Missing sprite in ${route.id || 'unknown_route'}:${scene.id} (${key}): ${spritePath}`);
                            throw e;
                        }
                    }
                });
            }
        });
    }

    describe('Prologue Assets', () => {
        it('should have valid background images', () => {
            prologueData.scenes.forEach(scene => {
                if (scene.background) {
                    expect(verifyAsset(scene.background)).toBe(true);
                }
            });
        });

        it('should have valid sprite images', () => {
            prologueData.scenes.forEach(scene => {
                if (scene.sprites) {
                    Object.values(scene.sprites).forEach(spritePath => {
                        if (typeof spritePath === 'string') {
                            expect(verifyAsset(spritePath)).toBe(true);
                        }
                    });
                }
            });
        });
    });

    describe('Ronnie Route Assets', () => {
        const ronnieRoutes = [ROUTES.ronnie, ROUTES.ronnie_act1, ROUTES.ronnie_act2, ROUTES.ronnie_act3, ROUTES.ronnie_endings];

        it('should have valid background and sprite images', () => {
            ronnieRoutes.forEach(route => {
                verifyRouteAssets(route as any);
            });
        });
    });

    describe('Tori Route Assets', () => {
        const toriRoutes = [ROUTES.tori_act1, ROUTES.tori_act2, ROUTES.tori_act3, ROUTES.tori_endings];

        it('should have valid background and sprite images', () => {
            toriRoutes.forEach(route => {
                verifyRouteAssets(route as any);
            });
        });
    });

    describe('Prologue Playthrough Simulation', () => {
        it('should form a connected chain of scenes', () => {
            const sceneMap = new Map(prologueData.scenes.map(s => [s.id, s]));

            // Start at first scene
            let currentId = 'scene1_streetBump';
            let steps = 0;
            const visited = new Set();

            while (currentId && currentId !== 'prologueComplete') {
                const scene = sceneMap.get(currentId);
                expect(scene).toBeDefined();
                visited.add(currentId);

                // Move next
                currentId = scene?.nextSceneId as string;
                steps++;

                // Safety break
                if (steps > 100) throw new Error('Infinite loop detected in prologue');
            }

            expect(visited.has('scene1_streetBump')).toBe(true);
            expect(visited.has('scene3_vision')).toBe(true);
            console.log(`✅ Simulated playthrough of ${steps} scenes in Prologue.`);
        });
    });

    describe('Ronnie Act 1 Logic', () => {
        it('should have branching choices for first conversation', () => {
            const sceneMap = new Map(ronnieData.scenes.map((s: any) => [s.id, s]));
            const narration = sceneMap.get('ronnie_act1Scene1_narration');

            expect(narration).toBeDefined();
            expect(narration.choices).toBeDefined();
            expect(narration.choices.length).toBe(3);

            // Verify Tender choice
            const tenderChoice = narration.choices.find((c: any) => c.text.includes('Tender'));
            expect(tenderChoice).toBeDefined();
            expect(tenderChoice.nextSceneId).toBe('ronnie_act1Scene1_outcome_tender');

            // Verify Outcome Flags
            const tenderOutcome = sceneMap.get('ronnie_act1Scene1_outcome_tender');
            expect(tenderOutcome.flags).toBeDefined();
            expect(tenderOutcome.flags.some((f: any) => f.flag === 'affection_up')).toBe(true);
        });
    });
    describe('Tori Route Act 1', () => {
        it('should form a connected chain of scenes', () => {
            const scenes = new Map(toriAct1Data.scenes.map((s: any) => [s.id, s]));
            const startSceneId = 'scene1_coffee'; // From JS source

            let currentScene = scenes.get(startSceneId);
            expect(currentScene).toBeDefined();

            const visited = new Set<string>();
            let sceneCount = 0;

            while (currentScene) {
                visited.add(currentScene.id);
                sceneCount++;
                // ...


                // Handle choices/next
                if (currentScene.choices && currentScene.choices.length > 0) {
                    // Pick the first choice for simple chain verification

                    // Wait, V2 Schema says `next` in choices.
                    // My migration script output `nextSceneId` for simple scenes.
                    // If migration produced choices? No, tori-route-act1.js didn't have choices in scene methods displayed.
                    // It was linear with `next: () => ...`

                    // So we expect linear `nextSceneId` mostly.
                    const nextIdTarget = currentScene.choices[0].nextSceneId || currentScene.choices[0].next;
                    currentScene = scenes.get(nextIdTarget);
                } else if (currentScene.nextSceneId) {
                    currentScene = scenes.get(currentScene.nextSceneId);
                } else {
                    console.log('Broken chain at:', currentScene.id, 'Next was:', currentScene.nextSceneId, 'Choices:', currentScene.choices);
                    currentScene = undefined;
                }

                if (currentScene && visited.has(currentScene.id)) {
                    // console.warn('Loop detected at', currentScene.id);
                    break;
                }

                if (sceneCount > 100) break; // Safety
            }

            // console.log(`✅ Simulated playthrough of ${sceneCount} scenes. Last valid: ${lastId}`);
            expect(sceneCount).toBeGreaterThan(40);
            expect(visited.has('scene8_program_ready')).toBe(true);
        });
    });
    describe('Tori Route Act 2', () => {
        it('should form a connected chain of scenes', () => {
            const scenes = new Map(toriAct2Data.scenes.map(s => [s.id, s]));
            let currentScene = scenes.get(toriAct2Data.scenes[0].id);
            const visited = new Set<string>();
            let sceneCount = 0;
            while (currentScene) {
                visited.add(currentScene.id);
                sceneCount++;

                // Handle choices/next
                if (currentScene.choices && currentScene.choices.length > 0) {
                    // Always pick first choice
                    const nextId = currentScene.choices[0].nextSceneId;
                    if (!nextId) {
                        // End of chain or bug
                        break;
                    }
                    currentScene = scenes.get(nextId);
                } else if (currentScene.nextSceneId) {
                    currentScene = scenes.get(currentScene.nextSceneId);
                } else {
                    // End of route or broken link
                    if (currentScene.nextSceneId === null) {
                        // Acceptable end
                    } else {
                        console.log('Broken chain at:', currentScene.id, 'Next was:', currentScene.nextSceneId);
                    }
                    currentScene = undefined;
                }

                if (currentScene && visited.has(currentScene.id)) {
                    break;
                }

                if (sceneCount > 100) break; // Safety
            }

            // console.log(`✅ Simulated playthrough of ${sceneCount} scenes in Tori Act 2. Last valid: ${lastId}`);
            expect(sceneCount).toBeGreaterThan(30);
        });
    });
    describe('Tori Route Act 3', () => {
        it('should form a connected chain of scenes', () => {
            const scenes = new Map(toriAct3Data.scenes.map(s => [s.id, s]));
            let currentScene = scenes.get(toriAct3Data.scenes[0].id);
            const visited = new Set<string>();
            let sceneCount = 0;
            while (currentScene) {
                visited.add(currentScene.id);
                sceneCount++;

                // Handle choices/next
                if (currentScene.choices && currentScene.choices.length > 0) {
                    // Always pick first choice
                    const nextId = currentScene.choices[0].nextSceneId;
                    if (!nextId) {
                        // End of chain or bug
                        break;
                    }
                    currentScene = scenes.get(nextId);
                } else if (currentScene.nextSceneId) {
                    currentScene = scenes.get(currentScene.nextSceneId);
                } else {
                    // End of route or broken link
                    if (currentScene.nextSceneId === null) {
                        // Acceptable end
                    } else {
                        console.log('Broken chain at:', currentScene.id, 'Next was:', currentScene.nextSceneId);
                    }
                    currentScene = undefined;
                }

                if (currentScene && visited.has(currentScene.id)) {
                    break;
                }

                if (sceneCount > 100) break; // Safety
            }

            // console.log(`✅ Simulated playthrough of ${sceneCount} scenes in Tori Act 3. Last valid: ${lastId}`);
            expect(sceneCount).toBeGreaterThan(30);
        });
    });

    describe('Tori Route Endings', () => {
        const scenes = new Map(toriEndingsData.scenes.map(s => [s.id, s]));

        it('should have a critical choice leading to 3 distinct paths', () => {
            const start = scenes.get('endings_criticalChoice');
            expect(start).toBeDefined();
            expect(start!.choices).toBeDefined();
            expect(start!.choices!.length).toBe(3);

            // Verify paths
            const paths = start!.choices!.map(c => c.nextSceneId);
            expect(paths).toContain('badRoute');
            expect(paths).toContain('trueRoute');
            expect(paths).toContain('digitalForever');
        });

        it('should complete Bad Route chain', () => {
            let current = scenes.get('badRoute');
            let steps = 0;
            while (current && current.nextSceneId) {
                current = scenes.get(current.nextSceneId);
                steps++;
                if (steps > 10) break;
            }
            expect(current).toBeDefined();
            // Should end at a known node or null
            expect(current!.id).toContain('badRoute');
        });

        it('should complete True Route chain', () => {
            let current = scenes.get('trueRoute');
            let steps = 0;
            while (current && current.nextSceneId) {
                current = scenes.get(current.nextSceneId);
                steps++;
                if (steps > 20) break;
            }
            expect(current).toBeDefined();
            expect(current!.id).toBe('tori_endings_trueRoute_always');
            expect(current!.nextSceneId).toBeNull();
        });

        it('should complete Digital Forever chain', () => {
            let current = scenes.get('digitalForever');
            let steps = 0;
            while (current && current.nextSceneId) {
                current = scenes.get(current.nextSceneId);
                steps++;
                if (steps > 20) break;
            }
            expect(current).toBeDefined();
            expect(current!.id).toContain('digitalForever');
            expect(current!.nextSceneId).toBeNull();
        });
    });

    describe('Ronnie Route', () => {
        it('Ronnie Act 1 should form a connected chain', () => {
            const scenes = new Map(ronnieAct1Data.scenes.map((s: any) => [s.id, s]));
            let current = scenes.get('ronnie_act1_prologueScene4'); // Start of migrated Act 1
            const visited = [];

            while (current) {
                visited.push(current.id);

                if (current.choices && current.choices.length > 0) {
                    current = scenes.get(current.choices[0].nextSceneId);
                } else if (current.nextSceneId) {
                    current = scenes.get(current.nextSceneId);
                } else {
                    break;
                }

                if (visited.length > 100) break;
            }

            // The loop breaks when we hit a scene ID that isn't in our map (act2Beat1_start)
            // So 'current' will definitely be undefined here. We check the LAST visited node instead.

            const lastId = visited[visited.length - 1];
            const lastScene = scenes.get(lastId);
            const exitNodeId = lastScene?.nextSceneId || lastScene?.choices?.[0]?.nextSceneId;

            expect(exitNodeId).toBe('startAct2');
            expect(visited.length).toBeGreaterThan(15);
        });

        it('Ronnie Act 2 should form a connected chain', () => {
            const scenes = new Map(ronnieAct2Data.scenes.map(s => [s.id, s]));
            let current = scenes.get('startAct2');
            const visited = [];

            while (current && current.nextSceneId) {
                visited.push(current.id);
                const nextInAct = scenes.get(current.nextSceneId);
                if (!nextInAct) break; // Cross-act chain (exits to act3)
                current = nextInAct;
                if (visited.length > 100) break; // Safety break
            }

            expect(current).toBeDefined();
            expect(current!.id).toBe('act2End');
            // act2End chains to act3Beat2 (cross-act transition)
            expect(current!.nextSceneId).toBe('act3Beat2');
            expect(visited.length).toBeGreaterThan(10);
        });

        it('Ronnie Act 3 should form a connected chain to Critical Choice', () => {
            const scenes = new Map(ronnieAct3Data.scenes.map(s => [s.id, s]));
            // Act 3 starts at 'act3Beat2' in the JSON (migration artifact)
            // or 'startAct3' if migration captured the start method?
            // Let's check the file content... it started with 'act3Beat2'
            // Wait, looking at file view, there is no 'startAct3' scene, the method calls 'act3Beat2'.
            // So we start at 'act3Beat2'.
            let current = scenes.get('act3Beat2');
            const visited = [];

            while (current && current.nextSceneId) {
                visited.push(current.id);
                current = scenes.get(current.nextSceneId);
                if (visited.length > 200) break;
            }

            expect(current).toBeDefined();
            expect(current!.id).toBe('act3CriticalChoice');
            expect(current!.choices).toBeDefined();
            expect(current!.choices!.length).toBe(3);
        });

        describe('Ronnie Endings', () => {
            const scenes = new Map(ronnieEndingsData.scenes.map(s => [s.id, s]));

            it('should verify True Route Ending chain', () => {
                let current = scenes.get('trueRouteEnding');
                const visited = [];
                while (current && current.nextSceneId) {
                    visited.push(current.id);
                    current = scenes.get(current.nextSceneId);
                    if (visited.length > 50) break;
                }
                expect(current).toBeDefined();
                expect(current!.id).toBe('trueRoute_final');
                expect(current!.nextSceneId).toBeNull();
            });

            it('should verify Bad Route Ending chain', () => {
                let current = scenes.get('badRouteEnding');
                const visited = [];
                while (current && current.nextSceneId) {
                    visited.push(current.id);
                    current = scenes.get(current.nextSceneId);
                    if (visited.length > 50) break;
                }
                expect(current).toBeDefined();
                // Bad route ends at badRoute_retry
                expect(current!.id).toBe('badRoute_retry');
                expect(current!.nextSceneId).toBeNull(); // It loops in V1, but null in V2 verification is fine or we check "badRoute_loopBegins"
            });

            it('should verify Digital Forever Ending chain', () => {
                let current = scenes.get('digitalForeverEnding');
                const visited = [];
                while (current && current.nextSceneId) {
                    visited.push(current.id);
                    current = scenes.get(current.nextSceneId);
                    if (visited.length > 50) break;
                }
                expect(current).toBeDefined();
                expect(current!.id).toBe('digitalForever_retry');
                expect(current!.nextSceneId).toBeNull();
            });
        });
    });

    describe('Epilogue Route', () => {
        it('should form a connected chain of scenes', () => {
            const scenes = new Map(epilogueData.scenes.map(s => [s.id, s]));
            let current = scenes.get('epilogue_start');
            const visited = [];

            while (current && current.nextSceneId) {
                visited.push(current.id);
                current = scenes.get(current.nextSceneId);
                if (visited.length > 20) break;
            }

            expect(current).toBeDefined();
            expect(current!.id).toBe('epilogue_knowing');
            expect(current!.nextSceneId).toBeNull();
            expect(visited.length).toBeGreaterThan(5);
        });
    });
});
