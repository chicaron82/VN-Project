Things Not Sitting Right

## V1 Portrait Mode

- ~~Swipe up doesn't close the notification shade~~ ✅ FIXED
  - Should close shade when swiping up
  - Currently conflicts with screenshot mode
- **Shade expansion only works on quick actions area**
  - Second swipe down should expand shade to full view
  - Currently only registers when swiping on the quick actions section
  - Should work when swiping down anywhere on the shade itself

## V2 Landscape Mode

- Swipe down doesn't open the sidebar
  - Should slide in from left when swiping down
- Grab bar doesn't reposition when sidebar opens
  - Should move to right edge of sidebar when expanded

## Showcase Website

- ~~Grab bar stuck at top~~ ✅ FIXED
  - ~~Not initializing properly on showcase page~~
  - Fixed CSS transform conflicts, added grab cursor, visual feedback
- ~~Landscape swipe down dims but doesn't open sidebar~~ ✅ FIXED
  - Added orientation detection to swipe handler
  - Landscape: opens sidebar, Portrait: opens shade
- ~~Dark/light mode styling inconsistencies~~ ✅ FIXED
  - Added @media (prefers-color-scheme) support across all sections
  - Hero banners, tabs, body text all adapt properly
