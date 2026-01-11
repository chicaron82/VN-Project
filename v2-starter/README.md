# Version 848 V2 - Clean Rebuild

This directory contains starter files and migration tools for rebuilding Version 848 with clean, maintainable architecture.

## What's Here

- `tsconfig.json` - TypeScript configuration with path mapping
- `scene-schema-example.ts` - Type definitions for scene content (the foundation)
- `migration-script-outline.ts` - Automated tool to convert V1 JS routes to JSON
- `REBUILD-START.md` - Quick start guide (in parent directory)

## Quick Start

1. **Review the schema** (`scene-schema-example.ts`)
   - This defines how scenes will be structured in V2
   - Make sure it covers all your V1 use cases

2. **Test the migration script** (`migration-script-outline.ts`)
   - This is an outline - needs implementation
   - Start with manual conversion of 1 scene to validate schema

3. **Set up Vite project**
   ```bash
   cd v2
   npm create vite@latest . -- --template vanilla-ts
   npm install
   ```

4. **Do a micro-migration**
   - Pick ONE complete scene from V1
   - Manually convert to JSON using the schema
   - Build a simple loader that validates it
   - Test: Load → Display → Save → Load

## Key Decisions

Before building 30 systems, validate your assumptions:

- [ ] Scene schema covers all V1 edge cases?
- [ ] JSON format works for all scene types?
- [ ] Validation catches errors clearly?
- [ ] Migration path is feasible?

## Next Steps

See `../REBUILD-START.md` for full action plan.
