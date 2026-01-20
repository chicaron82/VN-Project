# Rename src/ to v2/ and srcbridge/ to v2bridge/
# Run this script after closing VSCode/editors

Write-Host "Renaming folders..." -ForegroundColor Cyan

# Rename folders
Rename-Item -Path "src" -NewName "v2" -ErrorAction Stop
Rename-Item -Path "srcbridge" -NewName "v2bridge" -ErrorAction Stop

Write-Host "✓ Folders renamed successfully" -ForegroundColor Green
Write-Host ""
Write-Host "Now updating config files..." -ForegroundColor Cyan

# Update tsconfig.json
(Get-Content "tsconfig.json") -replace '"src/', '"v2/' | Set-Content "tsconfig.json"

# Update tsconfig.v2.json
(Get-Content "tsconfig.v2.json") -replace '"src/', '"v2/' | Set-Content "tsconfig.v2.json"

# Update vite.config.ts
(Get-Content "vite.config.ts") -replace "'src/", "'v2/" | Set-Content "vite.config.ts"
(Get-Content "vite.config.ts") -replace '"src/', '"v2/' | Set-Content "vite.config.ts"

# Update vite.config.showcase.ts
(Get-Content "vite.config.showcase.ts") -replace "'src/", "'v2/" | Set-Content "vite.config.showcase.ts"
(Get-Content "vite.config.showcase.ts") -replace '"src/', '"v2/' | Set-Content "vite.config.showcase.ts"

# Update vitest.config.js
(Get-Content "vitest.config.js") -replace "'src/", "'v2/" | Set-Content "vitest.config.js"
(Get-Content "vitest.config.js") -replace '"src/', '"v2/' | Set-Content "vitest.config.js"

# Update index.v2.html
(Get-Content "index.v2.html") -replace 'src="./src/', 'src="./v2/' | Set-Content "index.v2.html"
(Get-Content "index.v2.html") -replace 'from "./src/', 'from "./v2/' | Set-Content "index.v2.html"

# Update v1/index.html
(Get-Content "v1/index.html") -replace '\.\./src/', '../v2/' | Set-Content "v1/index.html"

# Update showcase/content-features.js
(Get-Content "showcase/content-features.js") -replace 'src/', 'v2/' | Set-Content "showcase/content-features.js"

# Update .gitignore if it references src/
if (Select-String -Path ".gitignore" -Pattern "^src/" -Quiet) {
    (Get-Content ".gitignore") -replace '^src/', 'v2/' | Set-Content ".gitignore"
}

# Update CLAUDE.md references
if (Test-Path "CLAUDE.md") {
    (Get-Content "CLAUDE.md") -replace 'in `src/', 'in `v2/' | Set-Content "CLAUDE.md"
    (Get-Content "CLAUDE.md") -replace '`src/', '`v2/' | Set-Content "CLAUDE.md"
}

Write-Host "✓ All config files updated" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review changes with: git status" -ForegroundColor White
Write-Host "2. Stage changes with: git add -A" -ForegroundColor White
Write-Host "3. Commit with descriptive message" -ForegroundColor White
Write-Host "4. Test the build: npm run build" -ForegroundColor White
