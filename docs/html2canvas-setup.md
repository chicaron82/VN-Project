# html2canvas Installation (Optional)

For full screenshot functionality in the Dev Suite, you can optionally install html2canvas.

## Option 1: CDN (Recommended for quick setup)

Add this to `index.html` before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
```

## Option 2: NPM (For production builds)

```bash
npm install html2canvas
```

Then import in your code:
```javascript
import html2canvas from 'html2canvas';
```

## Fallback

If html2canvas is not installed, the screenshot tool will use a basic canvas fallback that shows a placeholder message.

The screenshot feature will work either way, but html2canvas provides much better quality captures of the full game state.
