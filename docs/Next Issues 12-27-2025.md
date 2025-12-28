Next Issues
notification-shade-controller.js:834 Settings manager not available
openSettings @ notification-shade-controller.js:834
(anonymous) @ notification-shade-controller.js:172Understand this warning
error-handler.js:49 [Unhandled Error] TypeError: Cannot read properties of null (reading 'constructor')
    at SaveManager.createSaveData (save-manager.js:93:30)
    at SaveManager.saveGame (save-manager.js:63:31)
    at NotificationShadeController.quickSave (notification-shade-controller.js:787:35)
    at HTMLButtonElement.<anonymous> (notification-shade-controller.js:168:85)

the quick actions in the notification shade controller are not working

---

logger.js:58 🏭 Logger: Production mode enabled
theme-manager.js:291 🎨 Theme applied: Menu 🎮
theme-manager.js:159 🎨 ThemeManager initialized
vn-gateway-bridge.js:110 🌉 VN Gateway Bridge initialized
main.js:111 🚀 ES Modules loaded successfully!
VN-Project/:1647 DOM Content Loaded - Starting combined splash + loading
VN-Project/:1441 UV7 Splash: Initializing combined splash + loading...
VN-Project/:1660 Initializing GameEngine (loading will happen during splash)...
state-manager.js:83 💚 StateManager initialized
scene-renderer.js:18 🎬 SceneRenderer initialized
ui-controller.js:17 🎮 UIController initialized
error-handler.js:42 ✅ Global error handlers initialized
notification-shade-controller.js:185 ✅ Event listeners setup
notification-shade-controller.js:234 🔋 Tether update: isToriRoute=false, statusTether exists=true
state-manager.js:176 👂 Subscribed to: tether.level
notification-shade-controller.js:56 ✅ NotificationShadeController initialized
tutorial-manager.js:30 📚 TutorialManager initialized (event-driven mode)
scene-progression-controller.js:22 🎯 SceneProgressionController initialized
sprite-controller.js:22 🎨 SpriteController initialized
menu-controller.js:23 🎨 MenuController initialized
insane-visuals-controller.js:22 💀 InsaneVisualsController initialized
reset-controller.js:22 💥 ResetController initialized
state-manager.js:149 📝 State: game.loopVersion = 848
state-manager.js:149 📝 State: game.loopStatus = "attempting"
state-manager.js:149 📝 State: unlocks.skipUnlocked = true
state-manager.js:149 📝 State: unlocks.skipPrologueUnlocked = true
state-manager.js:149 📝 State: unlocks.ronnieNotesUnlocked = true
settings-manager.js:176 📦 Settings loaded from StateManager
settings-manager.js:995 Display mode applied: auto
settings-manager.js:995 Display mode applied: auto
visual-cue-manager.js:13 ✨ Visual Cue Manager initialized
time-machine-manager.js:22 ⏰ Time Machine Manager initialized
standalone-notes-viewer.js:41 Standalone viewer loaded notes from localStorage: {z: Array(1), cz: Array(0), zr: Array(0), gz: Array(1), iz: Array(1), …}
bootstrap-tracker.js:54 📜 Loaded timeline with 5 recorded attempts
bootstrap-tracker.js:41 📜 Bootstrap tracker initialized
bootstrap-tracker.js:42 Current attempt: #848
easter-egg-controller.js:18 🥚 EasterEggController initialized
game-engine.js:601 📳 Haptic feedback supported on this device
input-binder.js:12 🔌 InputBinder initialized
input-binder.js:24 ✅ All UI events bound successfully
tips-controller.js:40 🖤 Rotating tips system initialized
loop-controller.js:106 📍 Main menu updated: DEFAULT state (v848)
notification-shade-controller.js:234 🔋 Tether update: isToriRoute=false, statusTether exists=true
keyboard-controller.js:54 ⌨️ Initializing global keyboard navigation system
keyboard-controller.js:61 ✅ Keyboard navigation system initialized
game-engine.js:1178 ✅ Hierarchical ESC handler initialized
achievement-hooks.js:60 ⚠️ Backlog manager not ready yet, will hook later
achievement-hooks.js:76 🏆 Achievement hooks installed successfully
achievement-hooks.js:113 Achievement system fully initialized
game-engine.js:850 ✅ Loaded: assets/menudesktop.png (1/14)
game-engine.js:850 ✅ Loaded: assets/desktopVersion.webp (2/14)
game-engine.js:850 ✅ Loaded: assets/menumobile.webp (3/14)
game-engine.js:850 ✅ Loaded: assets/UnitedVoices7.webp (4/14)
game-engine.js:888 📦 Critical assets loaded
game-engine.js:850 ✅ Loaded: assets/tori-sprite.png (5/14)
VN-Project/:1589 UV7 Splash: Video ready to play
VN-Project/:1601 UV7 Splash: Video autoplay successful
game-engine.js:850 ✅ Loaded: assets/apartment.png (6/14)
game-engine.js:850 ✅ Loaded: assets/hospital.png (7/14)
game-engine.js:850 ✅ Loaded: assets/genericBack.png (8/14)
game-engine.js:850 ✅ Loaded: assets/ronnie-sprite.png (9/14)
game-engine.js:850 ✅ Loaded: assets/digitalSpace.png (10/14)
game-engine.js:892 📦 Gameplay assets loaded
game-engine.js:850 ✅ Loaded: assets/echo-1-sprite.png (11/14)
game-engine.js:850 ✅ Loaded: assets/echo-2-sprite.png (12/14)
game-engine.js:850 ✅ Loaded: assets/three-echoes-sprite.png (13/14)
game-engine.js:850 ✅ Loaded: assets/despair-sprite.png (14/14)
game-engine.js:896 📦 Route assets loaded
game-engine.js:919 ✅ Loading complete: 14/14 loaded in 323ms
game-engine.js:928 ⏱️ Fast load detected (323ms). Simulating smooth progress for 1677ms more...
game-engine.js:3151 GameEngine: Assets loaded, signaling splash screen...
VN-Project/:1472 UV7 Splash: Loading ready signal received
VN-Project/:1463 UV7 Splash: tryComplete (loading complete) - videoReady: false, loadingReady: true
VN-Project/:1638 UV7 Splash: Safety timeout reached
VN-Project/:1463 UV7 Splash: tryComplete (safety timeout) - videoReady: true, loadingReady: true
VN-Project/:1508 UV7 Splash: Completing splash sequence... 

the splash screen loading doesn't simulate the loading properly. i'm at home on wifi so it loads fast. which i think it recognizes. but i think it should simulate the loading and be completed when the animation is done.

on a slower connection let it load/wait till everything is done loading before going to main menu