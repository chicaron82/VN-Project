# Asset Optimization Guide

## Problem
`menumobile.png` is 2.6MB, causing slow loads and retry loops on mobile/slow connections.

## Solution: Free Online Tools

### Option 1: TinyPNG (Recommended)
**URL:** https://tinypng.com/

**Steps:**
1. Go to tinypng.com
2. Drag and drop `menumobile.png`
3. Wait for compression (usually 60-80% reduction)
4. Download optimized file
5. Replace original in `/assets/` folder

**Expected Result:** 2.6MB → ~500-700KB

---

### Option 2: Squoosh (Google's Tool)
**URL:** https://squoosh.app/

**Steps:**
1. Go to squoosh.app
2. Upload `menumobile.png`
3. Select compression format:
   - **WebP** (best compression, modern browsers)
   - **MozJPEG** (good compression, universal support)
4. Adjust quality slider (70-80% is sweet spot)
5. Download optimized file

**Expected Result:** 2.6MB → ~300-500KB (WebP)

---

### Option 3: Compress PNG (Batch Processing)
**URL:** https://compresspng.com/

**Steps:**
1. Go to compresspng.com
2. Upload multiple PNGs at once
3. Download compressed ZIP
4. Replace files in `/assets/` folder

**Good for:** Optimizing all assets at once

---

## Files to Optimize (Priority Order)

1. **menumobile.png** (2.6MB) - CRITICAL
2. **menu-bg.png** - Check size, optimize if >500KB
3. **route-select-ronnie.png** - Check size
4. **route-select-tori.png** - Check size
5. **UnitedVoices7.png** - Check size

## After Optimization

### Test Loading
1. Clear browser cache (Ctrl+Shift+Delete)
2. Reload page
3. Check DevTools Network tab
4. Verify no retry loops
5. Confirm faster load time

### Commit Changes
```bash
git add assets/
git commit -m "Optimize assets: compress menumobile.png and other large images"
git push
```

---

## Advanced: WebP with Fallback

If you want to use WebP (best compression), update CSS:

### Before:
```css
background-image: url('assets/menumobile.png');
```

### After:
```css
background-image: url('assets/menumobile.webp');
background-image: image-set(
    url('assets/menumobile.webp') type('image/webp'),
    url('assets/menumobile.png') type('image/png')
);
```

This gives you:
- WebP for modern browsers (~70% smaller)
- PNG fallback for older browsers

---

## Quick Win Checklist

- [ ] Go to tinypng.com
- [ ] Upload menumobile.png
- [ ] Download compressed version
- [ ] Replace in /assets/ folder
- [ ] Test loading (clear cache first)
- [ ] Commit and push

**Expected Impact:** 80% reduction in file size, eliminate retry loops, 2-3x faster loading on mobile.
