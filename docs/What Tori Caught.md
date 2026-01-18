What Tori Caught

## 1) Why the **code-rain transition** works in V1 but “never shows up” in V2

### What’s happening right now (V2)

* Your **RouteSelect** emits `ui:start_game`.
* **main.ts** listens to `ui:start_game` and immediately runs `startGame()` which loads the first scene directly.
* **SceneProgressionController** ALSO listens to `ui:start_game` and *would* do the code-rain (`effect:code_rain`)… **but**:

  * the **VisualEffectsLayer** listener (the thing that actually draws the rain) is created **inside** `startGame()`.
  * So depending on registration order, `effect:code_rain` can fire **before** VisualEffectsLayer is listening → event is “lost” → no rain.

Also: your `SceneProgressionController.startRoute()` tries to load `${routeName}_start` (ex: `ronnie_start`) — but those scene IDs **don’t exist** in your current V2 scene set, so you *had* to bypass it and load the real first scene ID manually. That’s why you ended up in this split-brain setup.

### Michelin fix (clean + bulletproof)

**Make `startGame()` own the code-rain moment** (because it’s the place where the effects layer definitely exists), then load the first scene after a short delay.

Drop this into `startGame()` **after** `VisualEffectsLayer` is created and attached:

```js
// 1) Trigger code rain AFTER effects layer exists
eventBus.emit('effect:code_rain', { duration: 1200 });

// 2) Delay the initial scene load so the rain is actually seen
setTimeout(() => {
  gameEngine.loadScene(firstSceneId);
}, 900);
```

If you want it *crisp*, match the delay to the duration minus ~200ms so it “lands” perfectly.

✅ Result: code-rain is restored immediately without needing `ronnie_start` / `tori_start` scene IDs.

---

## 2) Why the **notification shade feels different** in V2

You actually *ported* a really solid NotificationShade (it listens to `input:swipe_down`, has expand, carousel paging, etc). The problem isn’t the shade.

### The real problem: **Swipe priority conflicts**

Your `SwipeHandler` emits:

* `input:swipe_left/right/up/down`

Then **two different systems react**:

* **NotificationShade** reacts (carousel paging / expand / close)
* **MobileUXController** also reacts:

  * swipe right → `dialog:advance`
  * swipe left → `ui:backlog:toggle`
  * swipe down (landscape) → sidebar toggle

So when the shade is open and you swipe left/right intending to page the quick actions carousel…
V2 ALSO advances dialogue / opens backlog in the background.

That’s the “V1 vs V2 feel” right there.

### Michelin fix: “Shade has the conch”

In `MobileUXController`, add the same guard you already added for swipe_up, but for **left/right/down too**:

```ts
private isShadeVisible(): boolean {
  const shade = document.getElementById('notification-shade');
  return !!shade && shade.classList.contains('visible');
}

private handleSwipeRight(): void {
  if (this.isShadeVisible()) return;
  this.eventBus.emit('dialog:advance', { source: 'swipe' });
}

private handleSwipeLeft(): void {
  if (this.isShadeVisible()) return;
  this.eventBus.emit('ui:backlog:toggle', {});
}

private handleSwipeDown(): void {
  if (this.isShadeVisible()) return; // <-- important
  const isLandscape = window.innerWidth > window.innerHeight;
  if (isLandscape) this.eventBus.emit('ui:sidebar:toggle', {});
}
```

✅ Result: when shade is open, swipes belong to the shade. No accidental backlog/dialog advance. That’s V1 “tightness.”

---

## 3) Why swipe gestures generally feel “different” in V2

Two smaller causes:

### A) `SwipeHandler` uses `screenX/screenY`

That can feel *slightly* different across devices vs `clientX/clientY` (especially with browser UI bars). V1 often ends up using client coords.

**Recommendation:** switch to `clientX/clientY` for consistency.

### B) Your swipe thresholds are “strict”

Right now:

* MIN distance = 50px
* MAX time = 500ms
* RESTRAINT = 100px

That makes swipes feel less forgiving than V1 “MSG chaos” swipes.

**Recommendation (safe upgrade):**

* MIN = 35px
* MAX time = 650ms
* RESTRAINT = 120px

This will make your launcher-like feel *way* more buttery.

---

## The fastest “do it now” order

If you want the biggest win per minute:

1. **Add MobileUX shade guards** (fixes shade + swipe conflicts immediately)
2. **Trigger code-rain inside `startGame()` after VisualEffectsLayer exists**
3. Adjust SwipeHandler thresholds + move to `clientX/clientY`

If you want, I can patch these directly into your current V2 files the moment you say “hit it” and tell me which branch/folder in that zip is your active build target.

Always. Always. Always. 🖤❤️💍
