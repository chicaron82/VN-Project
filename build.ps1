# VERSION 848 - Production Build Script
# DIZEE POLISH: Minification and optimization

Write-Host "🔧 Building VERSION 848 for production..." -ForegroundColor Cyan

# Create build directory
$buildDir = "build"
if (Test-Path $buildDir) {
    Remove-Item $buildDir -Recurse -Force
}
New-Item -ItemType Directory -Path $buildDir | Out-Null

Write-Host "📁 Copying files..." -ForegroundColor Yellow

# Copy all necessary files
Copy-Item "index.html" $buildDir
Copy-Item "styles.css" $buildDir
Copy-Item "menu-carousel.css" $buildDir
Copy-Item "route-select-sprites.css" $buildDir
Copy-Item "route-select-toggle.css" $buildDir
Copy-Item "visual-cues.css" $buildDir
Copy-Item "vn-gateway-bridge.js" $buildDir

# Copy directories
Copy-Item "assets" $buildDir -Recurse
Copy-Item "system" $buildDir -Recurse
Copy-Item "ui" $buildDir -Recurse
Copy-Item "routes" $buildDir -Recurse
Copy-Item "docs" $buildDir -Recurse

Write-Host "✅ Files copied successfully!" -ForegroundColor Green

# Optional: Minify CSS (requires npm package 'clean-css-cli')
# Uncomment if you have clean-css-cli installed: npm install -g clean-css-cli
# Write-Host "🗜️ Minifying CSS..." -ForegroundColor Yellow
# cleancss -o "$buildDir/styles.min.css" "$buildDir/styles.css"
# cleancss -o "$buildDir/menu-carousel.min.css" "$buildDir/menu-carousel.css"

# Optional: Minify JS (requires npm package 'terser')
# Uncomment if you have terser installed: npm install -g terser
# Write-Host "🗜️ Minifying JavaScript..." -ForegroundColor Yellow
# Get-ChildItem "$buildDir/system/*.js" | ForEach-Object {
#     $minFile = $_.FullName -replace '\.js$', '.min.js'
#     terser $_.FullName -o $minFile --compress --mangle
# }

Write-Host ""
Write-Host "🎉 Build complete! Output in '$buildDir' directory" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Test the build by opening $buildDir/index.html" -ForegroundColor White
Write-Host "  2. For minification, install clean-css-cli and terser:" -ForegroundColor White
Write-Host "     npm install -g clean-css-cli terser" -ForegroundColor Gray
Write-Host "  3. Uncomment minification lines in this script" -ForegroundColor White
Write-Host "  4. Deploy the $buildDir folder to your web server" -ForegroundColor White
Write-Host ""
