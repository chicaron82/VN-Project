#!/bin/bash
# CSS Concatenation Build Script
# Combines all showcase CSS files into a single minified file

echo "🎨 Building showcase CSS..."

# Define source files in order
CSS_FILES=(
    "styles.css"
    "uv7-os.css"
    "uv7-app-switcher.css"
    "showcase-carousel.css"
    "who-section.css"
    "philosophy-card.css"
    "error-states.css"
    "visual-fixes.css"
    "loading-states.css"
)

# Output file
OUTPUT="showcase.combined.css"
MIN_OUTPUT="showcase.min.css"

# Remove old combined file if exists
rm -f "$OUTPUT" "$MIN_OUTPUT"

# Concatenate all CSS files
echo "/* =========================================="
echo "   UV7 Showcase - Combined Styles"
echo "   Generated: $(date)"
echo "   ========================================== */" > "$OUTPUT"
echo "" >> "$OUTPUT"

for file in "${CSS_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ Adding $file"
        echo "" >> "$OUTPUT"
        echo "/* ==========================================
   SOURCE: $file
   ========================================== */" >> "$OUTPUT"
        cat "$file" >> "$OUTPUT"
        echo "" >> "$OUTPUT"
    else
        echo "⚠️  Warning: $file not found, skipping..."
    fi
done

echo ""
echo "✅ Combined CSS created: $OUTPUT"

# Optional: Minify if you have a minifier installed
# Uncomment if you have clean-css-cli installed (npm install -g clean-css-cli)
# echo "🗜️  Minifying..."
# cleancss -o "$MIN_OUTPUT" "$OUTPUT"
# echo "✅ Minified CSS created: $MIN_OUTPUT"

# Show file sizes
echo ""
echo "📊 File sizes:"
du -h "$OUTPUT"
# du -h "$MIN_OUTPUT"

echo ""
echo "🎉 Build complete!"
echo ""
echo "To use the combined CSS, update index.html to:"
echo '<link rel="stylesheet" href="showcase.combined.css">'
