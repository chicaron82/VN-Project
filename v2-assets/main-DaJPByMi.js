(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();class x{constructor(e=100,t=!0){this.subscribers=new Map,this.history=[],this.maxHistorySize=e,this.historyEnabled=t}on(e,t){return this.subscribers.has(e)||this.subscribers.set(e,new Set),this.subscribers.get(e).add(t),()=>{const n=this.subscribers.get(e);n&&n.delete(t)}}emit(e,t){this.historyEnabled&&(this.history.push({event:e,data:t,timestamp:Date.now()}),this.history.length>this.maxHistorySize&&this.history.shift());const i=this.subscribers.get(e);i&&i.forEach(n=>{try{n(t)}catch(o){console.error(`Error in event callback for ${e}:`,o)}})}off(e,t){const i=this.subscribers.get(e);i&&i.delete(t)}clear(e){e?this.subscribers.delete(e):this.subscribers.clear()}getHistory(){return[...this.history]}clearHistory(){this.history=[]}setHistoryEnabled(e){this.historyEnabled=e}}class k{constructor(e={},t="vn_state"){this.state=this.deepClone(e),this.subscribers=new Map,this.isDirty=!1,this.persistenceKey=t}get(e){const t=this.getByPath(this.state,e);return t!=null&&typeof t=="object"?this.deepClone(t):t}set(e,t){const i=this.deepClone(t),n=this.get(e);this.deepEqual(n,i)||(this.setByPath(this.state,e,i),this.isDirty=!0,this.notifySubscribers(e,i,n))}subscribe(e,t){return this.subscribers.has(e)||this.subscribers.set(e,new Set),this.subscribers.get(e).add(t),()=>{const n=this.subscribers.get(e);n&&n.delete(t)}}save(){if(this.isDirty)try{const e=JSON.stringify(this.state);localStorage.setItem(this.persistenceKey,e),this.isDirty=!1}catch(e){console.error("Failed to save state:",e)}}load(){try{const e=localStorage.getItem(this.persistenceKey);if(!e)return!1;const t=JSON.parse(e);return this.state=t,this.isDirty=!1,this.subscribers.forEach((i,n)=>{const o=this.get(n);i.forEach(r=>{try{r(o,void 0)}catch(a){console.error(`Error in state subscription for ${n}:`,a)}})}),!0}catch(e){return console.error("Failed to load state:",e),!1}}getAll(){return this.deepClone(this.state)}setAll(e){this.state=this.deepClone(e),this.isDirty=!0,this.subscribers.forEach((t,i)=>{const n=this.get(i),o=void 0;t.forEach(r=>{try{r(n,o)}catch(a){console.error(`Error in state subscription for ${i}:`,a)}})})}getByPath(e,t){if(typeof t!="string")return;const i=t.split(".");let n=e;for(const o of i){if(n==null||typeof n!="object")return;n=n[o]}return n}setByPath(e,t,i){const n=t.split("."),o=n.pop();let r=e;for(const a of n)(!(a in r)||typeof r[a]!="object"||r[a]===null)&&(r[a]={}),r=r[a];r[o]=i}notifySubscribers(e,t,i){const n=this.subscribers.get(e);n&&n.forEach(o=>{try{o(t,i)}catch(r){console.error(`Error in state subscription for ${e}:`,r)}})}deepClone(e){if(e===null||typeof e!="object")return e;if(e instanceof Date)return new Date(e.getTime());if(e instanceof Array)return e.map(t=>this.deepClone(t));if(typeof e=="object"){const t={};for(const i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=this.deepClone(e[i]));return t}return e}deepEqual(e,t){if(e===t)return!0;if(e===null||t===null||typeof e!="object"||typeof t!="object")return!1;if(e instanceof Array&&t instanceof Array)return e.length!==t.length?!1:e.every((o,r)=>this.deepEqual(o,t[r]));const i=Object.keys(e),n=Object.keys(t);return i.length!==n.length?!1:i.every(o=>n.includes(o)&&this.deepEqual(e[o],t[o]))}}const S={VERSION:{CURRENT:"848"},TIMING:{TYPEWRITER_SPEED_MS:30}};class C{constructor(e){this.STORAGE_KEY="uv7_bootstrap_timeline",this.MAX_ATTEMPTS=5,this.stateManager=e,this.timeline=this.loadTimeline(),this.stateManager.set("game.loopVersion",this.timeline.currentAttempt)}loadTimeline(){try{const e=localStorage.getItem(this.STORAGE_KEY);if(e)return JSON.parse(e)}catch(e){console.warn("Failed to load bootstrap timeline:",e)}return this.createDefaultTimeline()}createDefaultTimeline(){return{currentAttempt:848,attempts:[{number:847,result:"failed",reason:"[DATA CORRUPTED]",route:"unknown",endingType:"corrupted",timestamp:null,dateString:"[UNREADABLE]"},{number:846,result:"failed",reason:"[DATA CORRUPTED]",route:"unknown",endingType:"corrupted",timestamp:null,dateString:"[UNREADABLE]"},{number:845,result:"failed",reason:"[DATA CORRUPTED]",route:"unknown",endingType:"corrupted",timestamp:null,dateString:"[UNREADABLE]"},{number:844,result:"failed",reason:"[DATA CORRUPTED]",route:"unknown",endingType:"corrupted",timestamp:null,dateString:"[UNREADABLE]"},{number:843,result:"failed",reason:"[DATA CORRUPTED]",route:"unknown",endingType:"corrupted",timestamp:null,dateString:"[UNREADABLE]"}]}}saveTimeline(){try{localStorage.setItem(this.STORAGE_KEY,JSON.stringify(this.timeline)),this.stateManager.set("game.loopVersion",this.timeline.currentAttempt)}catch(e){console.error("Failed to save bootstrap timeline:",e)}}recordAttempt(e,t,i,n){const o={number:this.timeline.currentAttempt,result:e,reason:t,route:i,endingType:n,timestamp:Date.now(),dateString:new Date().toLocaleString()};this.timeline.attempts.unshift(o),this.timeline.attempts.length>this.MAX_ATTEMPTS&&(this.timeline.attempts=this.timeline.attempts.slice(0,this.MAX_ATTEMPTS)),this.timeline.currentAttempt++,this.saveTimeline(),console.log(`📝 Recorded attempt #${o.number}: ${e} - ${t}`)}incrementAttempt(){this.timeline.currentAttempt++,this.saveTimeline()}getHistory(){return this.timeline}getCurrentAttempt(){return this.timeline.currentAttempt}reset(){this.timeline=this.createDefaultTimeline(),this.saveTimeline()}}class A{constructor(e,t,i,n){this.STORAGE_KEY="uv7_discovered_codes",this.eventBus=e,this.stateManager=t,this.bootstrapTracker=i,this.devCommentarySystem=n,this.discoveredCodes=this.loadDiscoveredCodes(),this.eventBus.on("ui:code_submit",this.handleCodeSubmit.bind(this)),this.codes=this.initializeCodes()}loadDiscoveredCodes(){try{const e=localStorage.getItem(this.STORAGE_KEY);return e?new Set(JSON.parse(e)):new Set}catch{return new Set}}saveDiscoveredCodes(){try{localStorage.setItem(this.STORAGE_KEY,JSON.stringify([...this.discoveredCodes]))}catch(e){console.error("Failed to save discovered codes",e)}}initializeCodes(){return{konami:{name:"Konami Code",description:"Enter the legendary code. Some knowledge transcends timelines.",icon:"🎮",reward:()=>{console.log("🎮 Konami Code Activated!"),this.stateManager.set("game.easterEggs.konami",!0),this.eventBus.emit("ui:screen_change",{screen:"secret_konami"})}},bootstrap:{name:"Loop Timeline",description:"Visualize every attempt that led here.",icon:"🔄",reward:()=>{console.log("🔄 Bootstrap Timeline usage requested"),this.eventBus.emit("visual:cue",{type:"glitch",channel:"ui"})}},848:{name:"True Attempt Number",description:"Your actual loop count.",icon:"🔢",reward:()=>{const e=this.bootstrapTracker.getCurrentAttempt();console.log(`🔢 True Attempt Number: ${e}`)}},reset848:{name:"Reset 848",description:"Dev Command: Reset Version",isDev:!0,reward:()=>{this.bootstrapTracker.reset(),window.location.reload()}},nuke:{name:"Nuclear Reset",description:"Clear ALL Data",isDev:!0,reward:()=>{localStorage.clear(),window.location.reload()}},chicharon:{name:"Dev Commentary",description:"Unlock behind-the-scenes notes.",icon:"🎙️",reward:()=>{this.devCommentarySystem&&(this.devCommentarySystem.unlockCommentary(),console.log("🎙️ Dev Commentary Unlocked"))}},uv7crew:{name:"Directors Cut",description:"Unlock extended crew statements.",icon:"🎬",reward:()=>{localStorage.setItem("directorsCutUnlocked","true"),console.log("🎬 Directors Cut Unlocked")}}}}handleCodeSubmit(e){const t=e.code.trim().toLowerCase(),i=this.codes[t];i?(i.reward(),!i.isDev&&!this.discoveredCodes.has(t)&&(this.discoveredCodes.add(t),this.saveDiscoveredCodes()),this.eventBus.emit("visual:cue",{type:"success",channel:"ui"}),this.eventBus.emit("tether:boost",{amount:5})):this.eventBus.emit("ui:denied",{})}getDiscoveredCodes(){return Array.from(this.discoveredCodes).filter(e=>this.codes[e]!==void 0).map(e=>({code:e,...this.codes[e]}))}}class R{constructor(e,t){this.eventBus=e,this.stateManager=t,this.commentaryData=this.initCommentaryData(),this.crewStatements=this.initCrewStatements(),this.bindEvents()}bindEvents(){this.eventBus.on("scene:load",e=>{this.checkCommentaryForScene(e.sceneId)})}checkCommentaryForScene(e){if(!this.isCommentaryUnlocked())return;(this.commentaryData[e]||this.findCommentaryByPartialMatch(e))&&this.eventBus.emit("visual:cue",{type:"commentary_available",channel:"ui"})}findCommentaryByPartialMatch(e){if(e.includes("prologue"))return this.commentaryData.prologue_street_bump;if(e==="main_menu")return this.commentaryData.main_menu_carousel}isCommentaryUnlocked(){return localStorage.getItem("devCommentaryUnlocked")==="true"}isDirectorsCutUnlocked(){return localStorage.getItem("directorsCutUnlocked")==="true"}unlockCommentary(){localStorage.setItem("devCommentaryUnlocked","true"),this.stateManager.set("settings.devCommentaryUnlocked",!0)}getCommentary(e){return this.commentaryData[e]}getDirectorsCutStatements(){return this.crewStatements}initCommentaryData(){return{prologue_street_bump:{id:"prologue_street_bump",title:"The French Vanilla Detail",scene:"Street Bump (Prologue)",content:"The French Vanilla coffee Tori picks up for Ronnie? That's how Old Ronnie knows where she'll be for the street bump. He's lived this loop hundreds of times. He knows her routine. That small detail is actually critical to the bootstrap paradox working."},route_selection_dual:{id:"route_selection_dual",title:"Why Two Routes?",scene:"Route Selection",content:"Originally this was just Ronnie's story. But during that Applebee's dinner with Tori, we realized it would be way more interesting as dual perspectives."},main_menu_carousel:{id:"main_menu_carousel",title:"The Price Is Right Carousel",scene:"Main Menu",content:"The carousel momentum came from a conversation with Zee. I told her I wanted it to feel like spinning the big wheel on The Price Is Right."},bad_ending_retry:{id:"bad_ending_retry",title:"The Bootstrap Paradox",scene:"Bad Ending",content:`I was at work when the retry mechanic clicked for me. What if retries weren't just "try again" - what if they were CANON?`}}}initCrewStatements(){return[{name:"ZeeRah",text:"Working with Aaron was like debugging a fever dream that somehow compiled..."},{name:"DiZee",text:'I got called in for "quick fixes" that turned into archeological digs through nested systems...'}]}}class L{constructor(e,t){this.STORAGE_KEY="uv7_achievements",this.eventBus=e,this.achievements=this.initializeAchievements(),this.loadAchievements(),this.bindEvents()}bindEvents(){this.eventBus.on("achievement:unlock",e=>{this.unlock(e.id)})}initializeAchievements(){const e={speed_runner:{id:"speed_runner",name:"Speed Runner",description:"Complete any route in under 30 minutes",icon:"🏃"},archivist:{id:"archivist",name:"Archivist",description:"Collect all 13 notes on Tori's route",icon:"📚"},time_traveler:{id:"time_traveler",name:"Time Traveler",description:"Reach any ending",icon:"🔄"},heartbreaker:{id:"heartbreaker",name:"Heartbreaker",description:"Reach the bad ending",icon:"💔"},true_ending:{id:"true_ending",name:"True Ending",description:"Reach the true ending",icon:"✨"},completionist:{id:"completionist",name:"Completionist",description:"Unlock all endings",icon:"🎮"},pet_parent:{id:"pet_parent",name:"Pet Parent",description:"Unlock ToriGatchi",icon:"🐣"},insane:{id:"insane",name:"Insane",description:"Complete Insane Mode",icon:"⚡"},explorer:{id:"explorer",name:"Explorer",description:"View 100+ dialogue entries in backlog",icon:"🔍"},tactical_retreat:{id:"tactical_retreat",name:"Tactical Retreat",description:"Used Konami Code to escape INSANE mode",icon:"🏃"},masochist:{id:"masochist",name:"Masochist",description:"Stayed in INSANE mode after finding the exit",icon:"😈"},remembered:{id:"remembered",name:"Remembered",description:"All three echoes have noticed you",icon:"👁️"}},t={};return Object.values(e).forEach(i=>{t[i.id]={...i,unlocked:!1,unlockedAt:null}}),t}loadAchievements(){try{const e=localStorage.getItem(this.STORAGE_KEY);if(e){const t=JSON.parse(e);Object.keys(t).forEach(i=>{this.achievements[i]&&(this.achievements[i].unlocked=t[i].unlocked,this.achievements[i].unlockedAt=t[i].unlockedAt)})}}catch(e){console.error("Failed to load achievements",e)}}saveAchievements(){try{localStorage.setItem(this.STORAGE_KEY,JSON.stringify(this.achievements))}catch(e){console.error("Failed to save achievements",e)}}unlock(e){const t=this.achievements[e];t&&(t.unlocked||(t.unlocked=!0,t.unlockedAt=Date.now(),this.saveAchievements(),console.log(`🏆 Achievement Unlocked: ${t.name}`),this.eventBus.emit("visual:cue",{type:"achievement",channel:"ui"})))}isUnlocked(e){var t;return((t=this.achievements[e])==null?void 0:t.unlocked)||!1}getAchievements(){return Object.values(this.achievements)}}class I{constructor(e,t){this.isInitialized=!1,this.eventBus=e,this.stateManager=t,this.scenes=new Map,this.bootstrapTracker=new C(t),this.devCommentarySystem=new R(e,t),this.achievementSystem=new L(e,t),this.secretCodesSystem=new A(e,t,this.bootstrapTracker,this.devCommentarySystem)}async init(){this.isInitialized||(this.isInitialized=!0,console.log(`🚀 GameEngine initialized (v${S.VERSION.CURRENT})`))}registerScene(e){this.scenes.has(e.id)&&console.warn(`Scene ${e.id} already registered. Overwriting.`),this.scenes.set(e.id,e)}async loadScene(e){const t=this.scenes.get(e);if(!t){console.error(`❌ Scene not found: ${e}`);return}if(this.stateManager.set("currentScene",e),this.eventBus.emit("scene:load",{sceneId:e}),t.tetherImpact){const i=this.stateManager.get("tetherLevel")||100;this.stateManager.set("tetherLevel",Math.max(0,Math.min(100,i+t.tetherImpact)))}console.log(`loaded scene: ${e}`)}async start(){this.isInitialized||await this.init()}getScene(e){return this.scenes.get(e)}}const _={textSpeed:S.TIMING.TYPEWRITER_SPEED_MS,hapticsEnabled:!0,comfortLevel:1,volume:1,animationsEnabled:!0,fontSize:"normal",highContrast:!1};class M{constructor(e){this.STORAGE_KEY="v848_settings",this.stateManager=e}init(){const e=this.loadFromStorage(),t={..._,...e};this.stateManager.set("settings",t),this.applySettings(t)}applySettings(e){if(typeof document>"u")return;const t=document.body;e.animationsEnabled?t.classList.remove("reduced-motion"):t.classList.add("reduced-motion"),e.highContrast?t.classList.add("high-contrast"):t.classList.remove("high-contrast"),t.classList.remove("font-normal","font-large","font-xl"),t.classList.add(`font-${e.fontSize}`)}get(e){return this.stateManager.get(`settings.${e}`)}set(e,t){this.stateManager.set(`settings.${e}`,t),this.saveToStorage();const i=this.stateManager.get("settings");this.applySettings(i)}getHapticEnabled(){return this.get("hapticsEnabled")}getComfortIntensity(){return this.get("comfortLevel")}loadFromStorage(){if(typeof localStorage>"u")return{};try{const e=localStorage.getItem(this.STORAGE_KEY);return e?JSON.parse(e):{}}catch(e){return console.warn("Failed to load settings",e),{}}}saveToStorage(){if(!(typeof localStorage>"u"))try{const e=this.stateManager.get("settings");localStorage.setItem(this.STORAGE_KEY,JSON.stringify(e))}catch(e){console.warn("Failed to save settings",e)}}}class N{constructor(e){var t,i;this.currentIndex=0,this.eventBus=e,this.items=[{id:"start",title:"START",icon:"▶️",subtitle:"Begin the cycle",action:"ui:route_select"},{id:"load",title:"LOAD",icon:"📂",subtitle:"Resume timeline",action:"ui:load_menu"},{id:"settings",title:"SETTINGS",icon:"⚙️",subtitle:"Adjust reality",action:"ui:settings"},{id:"credits",title:"CREW",icon:"👥",subtitle:"The UV7 Team",action:"ui:credits"}],this.container=document.createElement("div"),this.container.className="menu-carousel",this.container.innerHTML=`
            <button class="carousel-arrow carousel-prev">◀</button>
            <div class="carousel-viewport">
                <div class="carousel-track"></div>
            </div>
            <button class="carousel-arrow carousel-next">▶</button>
            <div class="carousel-dots"></div>
            <div class="carousel-hint">Press ENTER to Select</div>
        `,this.track=this.container.querySelector(".carousel-track"),(t=this.container.querySelector(".carousel-prev"))==null||t.addEventListener("click",()=>this.prev()),(i=this.container.querySelector(".carousel-next"))==null||i.addEventListener("click",()=>this.next()),this.renderItems()}mount(e){e.appendChild(this.container),this.updateView()}unmount(){this.container.remove()}renderItems(){this.track.innerHTML="",this.items.forEach((t,i)=>{const n=document.createElement("div");n.className=`carousel-card ${t.locked?"locked":""}`,n.dataset.index=i.toString(),n.innerHTML=`
                <div class="card-icon">${t.icon}</div>
                <div class="card-title">${t.title}</div>
                <div class="card-subtitle">${t.subtitle}</div>
                <button class="card-button">${t.locked?"LOCKED":"SELECT"}</button>
            `,n.addEventListener("click",()=>{this.currentIndex===i?this.select():(this.currentIndex=i,this.updateView())}),this.track.appendChild(n)});const e=this.container.querySelector(".carousel-dots");e.innerHTML=this.items.map((t,i)=>`<div class="carousel-dot" data-index="${i}"></div>`).join("")}updateView(){const i=-(this.currentIndex*420);this.track.style.transform=`translateX(${i}px)`,this.track.querySelectorAll(".carousel-card").forEach((r,a)=>{a===this.currentIndex?r.classList.add("card-active"):r.classList.remove("card-active")}),this.container.querySelectorAll(".carousel-dot").forEach((r,a)=>{a===this.currentIndex?r.classList.add("active"):r.classList.remove("active")})}prev(){this.currentIndex>0&&(this.currentIndex--,this.updateView(),this.eventBus.emit("ui:click",{}))}next(){this.currentIndex<this.items.length-1&&(this.currentIndex++,this.updateView(),this.eventBus.emit("ui:click",{}))}select(){const e=this.items[this.currentIndex];e&&(e.locked?this.eventBus.emit("ui:denied",{}):(this.eventBus.emit(e.action,{}),this.eventBus.emit("ui:confirm",{})))}}class B{constructor(e){this.container=document.createElement("div"),this.container.id="main-menu",this.container.className="screen-container",this.container.style.display="flex",this.container.style.flexDirection="column",this.container.style.alignItems="center",this.container.style.justifyContent="center",this.container.style.height="100%",this.container.style.width="100%",this.container.style.background='url("assets/desktopVersion.webp") no-repeat center center/cover',this.container.innerHTML=`
            <div id="main-menu-content" style="text-align: center; z-index: 10;">
                <h1 style="font-size: 4rem; margin-bottom: 0.5rem; text-shadow: 0 0 20px cyan;">VERSION 848</h1>
                <div class="subtitle" style="font-size: 1.2rem; margin-bottom: 2rem; color: #ccc;">My Wife Is in a Coma... and in the Code</div>
            </div>
            <div class="menu-footer" style="position: absolute; bottom: 20px; font-size: 0.8rem; color: #666;">
                [Version 848 - 847 previous failures]
            </div>
        `,this.carousel=new N(e)}mount(e){e.appendChild(this.container);const t=this.container.querySelector("#main-menu-content");this.carousel.mount(t)}unmount(){this.carousel.unmount(),this.container.remove()}}class D{constructor(e){this.selectedRoute="ronnie",this.eventBus=e,this.container=document.createElement("div"),this.container.id="route-select",this.container.innerHTML=`
            <div id="route-select-content">
                <div id="route-select-title">
                    <h2>CHOOSE YOUR PERSPECTIVE</h2>
                    <p>Two routes. Two truths. One bridge between them.</p>
                </div>

                <div id="route-portraits-container">
                    <div class="route-portrait ronnie-portrait active">
                        <!-- Placeholder images until assets are guaranteed -->
                        <div style="width: 200px; height: 300px; background: cyan; opacity: 0.5;">Ronnie Proxy</div>
                    </div>
                    <div class="route-portrait tori-portrait">
                        <div style="width: 200px; height: 300px; background: magenta; opacity: 0.5;">Tori Proxy</div>
                    </div>
                </div>

                <div id="route-toggle">
                    <button class="toggle-option active" data-route="ronnie">RONNIE</button>
                    <button class="toggle-option" data-route="tori">TORI</button>
                </div>

                <div id="route-info-display">
                     <div class="route-info-text">
                        <h3>RONNIE</h3>
                        <p>Fighting from the outside.</p>
                     </div>
                </div>

                <button id="route-play-button">PLAY AS RONNIE</button>
                <button id="back-to-menu">BACK</button>
            </div>
        `,this.bindEvents()}bindEvents(){var t,i;this.container.querySelectorAll(".toggle-option").forEach(n=>{n.addEventListener("click",o=>{const r=o.target.dataset.route;this.selectRoute(r)})}),(t=this.container.querySelector("#route-play-button"))==null||t.addEventListener("click",()=>{this.eventBus.emit("ui:start_game",{route:this.selectedRoute})}),(i=this.container.querySelector("#back-to-menu"))==null||i.addEventListener("click",()=>{this.eventBus.emit("ui:main_menu",{})})}selectRoute(e){var o,r;this.selectedRoute=e,this.eventBus.emit("ui:click",{}),this.container.querySelectorAll(".route-portrait").forEach(a=>a.classList.remove("active")),e==="ronnie"?(o=this.container.querySelector(".ronnie-portrait"))==null||o.classList.add("active"):(r=this.container.querySelector(".tori-portrait"))==null||r.classList.add("active");const i=this.container.querySelector("#route-play-button");i.innerText=`PLAY AS ${e.toUpperCase()}`,i.style.color=e==="ronnie"?"cyan":"magenta",i.style.borderColor=e==="ronnie"?"cyan":"magenta";const n=this.container.querySelector(".route-info-text");e==="ronnie"?n.innerHTML="<h3>RONNIE</h3><p>Fighting from the outside.</p>":n.innerHTML="<h3>TORI</h3><p>Trapped in the void.</p>"}mount(e){e.appendChild(this.container)}unmount(){this.container.remove()}}class O{constructor(e){this.eventBus=e,this.container=document.createElement("div"),this.container.id="pause-menu",this.container.className="overlay-screen",this.container.style.position="absolute",this.container.style.top="0",this.container.style.left="0",this.container.style.width="100%",this.container.style.height="100%",this.container.style.background="rgba(0,0,0,0.8)",this.container.style.display="flex",this.container.style.flexDirection="column",this.container.style.alignItems="center",this.container.style.justifyContent="center",this.container.style.zIndex="1000",this.container.innerHTML=`
            <div class="pause-content" style="background: black; border: 2px solid cyan; padding: 2rem; text-align: center;">
                <h2 style="color: cyan; margin-bottom: 2rem;">PAUSED</h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <button id="resume-btn" style="border: 1px solid cyan; padding: 10px; color: cyan;">RESUME</button>
                    <button id="settings-btn" style="border: 1px solid cyan; padding: 10px; color: cyan;">SETTINGS</button>
                    <button id="quit-btn" style="border: 1px solid red; padding: 10px; color: red;">QUIT TO MENU</button>
                </div>
            </div>
        `,this.bindEvents()}bindEvents(){var e,t;(e=this.container.querySelector("#resume-btn"))==null||e.addEventListener("click",()=>{this.eventBus.emit("ui:pause_toggle",{})}),(t=this.container.querySelector("#quit-btn"))==null||t.addEventListener("click",()=>{this.eventBus.emit("ui:main_menu",{})})}mount(e){e.appendChild(this.container)}unmount(){this.container.remove()}}class z{constructor(e,t){this.container=document.createElement("div"),this.container.id="app-root",this.container.className="game-layout",this.viewport=document.createElement("div"),this.viewport.className="game-viewport",this.viewport.id="game-viewport",this.statusBar=document.createElement("div"),this.statusBar.className="status-bar",this.statusBar.innerHTML=`
        <div class="version-display">v848</div>
        <div class="tether-display">
            <div class="tether-overlay">
                <div class="tether-fill" id="tether-fill" style="width: 100%;"></div>
            </div>
        </div>
    `,this.tetherFill=this.statusBar.querySelector("#tether-fill"),this.dialogBox=document.createElement("div"),this.dialogBox.className="dialog-box",this.dialogBox.id="dialogue-box",this.dialogBox.innerHTML=`
        <div class="name-label" id="name-label">???</div>
        <div class="dialog-text" id="dialog-text"></div>
    `,this.dialogName=this.dialogBox.querySelector("#name-label"),this.dialogText=this.dialogBox.querySelector("#dialog-text"),this.container.appendChild(this.viewport),this.container.appendChild(this.statusBar),this.container.appendChild(this.dialogBox);const i=document.getElementById(e);i?(i.innerHTML="",i.appendChild(this.container)):console.error(`Root element #${e} not found`)}updateTether(e){this.tetherFill&&(this.tetherFill.style.width=`${Math.max(0,Math.min(100,e))}%`,e<30?this.tetherFill.style.background="var(--grad-tether-critical)":e<50?this.tetherFill.style.background="var(--grad-tether-warning)":this.tetherFill.style.background="var(--grad-tether-healthy)")}}class U{constructor(e,t,i){this.container=e,this.overlayContainer=t,this.eventBus=i,this.bindEvents()}bindEvents(){this.eventBus.on("effect:glitch",e=>this.triggerGlitch(e.intensity)),this.eventBus.on("effect:shake",e=>this.triggerShake(e.intensity)),this.eventBus.on("effect:flash",e=>this.triggerFlash(e.color,e.duration)),this.eventBus.on("effect:code_rain",e=>this.triggerCodeRain(e.duration))}triggerGlitch(e){this.container.classList.add("effect-glitch");const t=Math.max(200,e*1e3);setTimeout(()=>{this.container.classList.remove("effect-glitch")},t)}triggerShake(e){const t=e==="heavy"?"effect-shake-heavy":"effect-shake-medium";this.container.classList.add(t),setTimeout(()=>{this.container.classList.remove(t)},800)}triggerFlash(e,t){const i=document.createElement("div");i.className="effect-flash-overlay",i.style.background=e,i.style.animationDuration=`${t}ms`,this.overlayContainer.appendChild(i),setTimeout(()=>{i.remove()},t+50)}triggerCodeRain(e){console.log(`🌧️ Code Rain triggered for ${e}ms`);const t=document.createElement("div");t.className="effect-code-rain",t.innerText="0101010101 (Code Rain Placeholder)",t.style.color="#0f0",t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="center",t.style.fontSize="2rem",t.style.background="rgba(0,0,0,0.5)",this.overlayContainer.appendChild(t),setTimeout(()=>{t.remove()},e)}}const c=new x,p=new k({currentScene:"none",currentRoute:null,tetherLevel:100,flags:{},history:[],playtime:0}),h=new M(p);h.init();const v=new I(c,p),d=document.getElementById("app");if(!d)throw new Error("No #app element found");let m=null,u=null,l=null,g=!1;function f(){m&&(m.unmount(),m=null),d.innerHTML=""}function P(){return new Promise(s=>{const e=document.createElement("div");e.id="splash-screen",e.style.cssText=`
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: #000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: 'Courier New', monospace;
            color: #0f0;
        `,e.innerHTML=`
            <div style="text-align: center;">
                <h1 style="font-size: 3rem; margin-bottom: 1rem; text-shadow: 0 0 20px #0f0;">
                    VERSION 848
                </h1>
                <div style="font-size: 1rem; color: #0a0; margin-bottom: 2rem;">
                    V2 - Clean TypeScript Rebuild
                </div>
                <div class="boot-sequence" style="font-size: 0.9rem; color: #0f0; opacity: 0.8;">
                    <div id="boot-line-1">Initializing systems...</div>
                    <div id="boot-line-2" style="opacity: 0;">Loading EventBus...</div>
                    <div id="boot-line-3" style="opacity: 0;">Establishing tether...</div>
                    <div id="boot-line-4" style="opacity: 0;">Ready.</div>
                </div>
                <div style="margin-top: 2rem;">
                    <div style="width: 200px; height: 4px; background: #333; border-radius: 2px; overflow: hidden;">
                        <div id="progress-bar" style="width: 0%; height: 100%; background: #0f0; transition: width 0.3s;"></div>
                    </div>
                </div>
            </div>
        `,d.appendChild(e);const t=e.querySelector("#progress-bar"),i=[e.querySelector("#boot-line-2"),e.querySelector("#boot-line-3"),e.querySelector("#boot-line-4")];let n=0;const o=setInterval(()=>{n+=Math.random()*15+5,n>=100&&(n=100,clearInterval(o)),t.style.width=`${n}%`,n>25&&i[0]&&(i[0].style.opacity="1"),n>50&&i[1]&&(i[1].style.opacity="1"),n>75&&i[2]&&(i[2].style.opacity="1"),n>=100&&setTimeout(()=>{e.style.transition="opacity 0.5s",e.style.opacity="0",setTimeout(()=>{e.remove(),s()},500)},500)},150)})}function y(){f();const s=new B(c);s.mount(d),m=s,console.log("[UV7 V2] Main Menu")}function E(){f();const s=new D(c);s.mount(d),m=s,console.log("[UV7 V2] Route Select")}function V(){var t,i,n,o,r;const s=document.createElement("div");s.id="settings-overlay",s.style.cssText=`
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 5000;
        font-family: 'Courier New', monospace;
        color: #0ff;
    `;const e=p.get("settings")??{};s.innerHTML=`
        <div style="max-width: 500px; width: 90%; text-align: center;">
            <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #0ff;">SETTINGS</h2>

            <div style="text-align: left; margin-bottom: 2rem;">
                <div style="margin-bottom: 1rem;">
                    <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer;">
                        <input type="checkbox" id="haptics-toggle" ${e.hapticsEnabled?"checked":""}
                            style="width: 20px; height: 20px;">
                        <span>Haptic Feedback</span>
                    </label>
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display: flex; align-items: center; gap: 1rem; cursor: pointer;">
                        <input type="checkbox" id="animations-toggle" ${e.animationsEnabled!==!1?"checked":""}
                            style="width: 20px; height: 20px;">
                        <span>Animations</span>
                    </label>
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Text Speed</label>
                    <input type="range" id="text-speed" min="10" max="100" value="${100-(e.textSpeed||30)}"
                        style="width: 100%;">
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem;">Font Size</label>
                    <select id="font-size" style="width: 100%; padding: 0.5rem; background: #111; color: #0ff; border: 1px solid #0ff;">
                        <option value="normal" ${e.fontSize==="normal"?"selected":""}>Normal</option>
                        <option value="large" ${e.fontSize==="large"?"selected":""}>Large</option>
                        <option value="xl" ${e.fontSize==="xl"?"selected":""}>Extra Large</option>
                    </select>
                </div>
            </div>

            <button id="settings-close" style="
                background: transparent;
                border: 2px solid #0ff;
                color: #0ff;
                padding: 1rem 2rem;
                font-family: inherit;
                font-size: 1rem;
                cursor: pointer;
            ">CLOSE</button>
        </div>
    `,d.appendChild(s),(t=s.querySelector("#haptics-toggle"))==null||t.addEventListener("change",a=>{h.set("hapticsEnabled",a.target.checked)}),(i=s.querySelector("#animations-toggle"))==null||i.addEventListener("change",a=>{h.set("animationsEnabled",a.target.checked)}),(n=s.querySelector("#text-speed"))==null||n.addEventListener("input",a=>{const T=parseInt(a.target.value);h.set("textSpeed",100-T+10)}),(o=s.querySelector("#font-size"))==null||o.addEventListener("change",a=>{h.set("fontSize",a.target.value)}),(r=s.querySelector("#settings-close"))==null||r.addEventListener("click",()=>{s.remove()}),console.log("[UV7 V2] Settings")}function $(){var e;const s=document.createElement("div");s.id="credits-overlay",s.style.cssText=`
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: #000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        z-index: 5000;
        font-family: 'Courier New', monospace;
        color: #fff;
        overflow-y: auto;
        padding: 2rem;
    `,s.innerHTML=`
        <div style="max-width: 600px; text-align: center; padding-bottom: 4rem;">
            <h1 style="font-size: 2.5rem; color: #0ff; margin-bottom: 2rem;">THE UV7 CREW</h1>

            <div style="margin-bottom: 3rem;">
                <h3 style="color: #0f0; margin-bottom: 0.5rem;">Created By</h3>
                <p style="font-size: 1.2rem;">The UV7 Family</p>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 style="color: #0f0; margin-bottom: 0.5rem;">Story & Design</h3>
                <p>Chicaron82</p>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 style="color: #0f0; margin-bottom: 0.5rem;">Technical Architecture</h3>
                <p>V2 TypeScript Rebuild</p>
                <p style="color: #888; font-size: 0.9rem;">Clean code, type safety, maintainability</p>
            </div>

            <div style="margin-bottom: 3rem;">
                <h3 style="color: #0f0; margin-bottom: 0.5rem;">AI Collaboration</h3>
                <p>Claude (Anthropic)</p>
                <p style="color: #888; font-size: 0.9rem;">Pair programming partner</p>
            </div>

            <div style="margin-bottom: 3rem; padding: 1rem; border: 1px solid #333;">
                <p style="color: #888; font-style: italic;">
                    "847 failures. This is attempt 848."
                </p>
            </div>

            <button id="credits-close" style="
                background: transparent;
                border: 2px solid #0ff;
                color: #0ff;
                padding: 1rem 2rem;
                font-family: inherit;
                font-size: 1rem;
                cursor: pointer;
                margin-top: 2rem;
            ">BACK TO MENU</button>
        </div>
    `,d.appendChild(s),(e=s.querySelector("#credits-close"))==null||e.addEventListener("click",()=>{s.remove()}),console.log("[UV7 V2] Credits")}function q(){var t;const s=document.createElement("div");s.id="load-overlay",s.style.cssText=`
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 5000;
        font-family: 'Courier New', monospace;
        color: #0ff;
    `;const e=[];for(let i=1;i<=5;i++){const n=`v848_save_${i}`,o=localStorage.getItem(n);e.push(o?`Slot ${i}: Save found`:`Slot ${i}: Empty`)}s.innerHTML=`
        <div style="max-width: 500px; width: 90%; text-align: center;">
            <h2 style="font-size: 2rem; margin-bottom: 2rem; color: #0ff;">LOAD GAME</h2>

            <div style="margin-bottom: 2rem;">
                ${e.map((i,n)=>`
                    <div style="
                        padding: 1rem;
                        margin-bottom: 0.5rem;
                        border: 1px solid ${i.includes("found")?"#0ff":"#333"};
                        color: ${i.includes("found")?"#0ff":"#666"};
                        cursor: ${i.includes("found")?"pointer":"not-allowed"};
                    " class="save-slot" data-slot="${n+1}">
                        ${i}
                    </div>
                `).join("")}
            </div>

            <p style="color: #666; margin-bottom: 2rem; font-size: 0.9rem;">
                Save system available during gameplay
            </p>

            <button id="load-close" style="
                background: transparent;
                border: 2px solid #0ff;
                color: #0ff;
                padding: 1rem 2rem;
                font-family: inherit;
                font-size: 1rem;
                cursor: pointer;
            ">BACK</button>
        </div>
    `,d.appendChild(s),(t=s.querySelector("#load-close"))==null||t.addEventListener("click",()=>{s.remove()}),console.log("[UV7 V2] Load Menu")}function w(s){f(),p.set("currentRoute",s),p.set("tetherLevel",100),l=new z("app",c),l&&new U(l.viewport,l.viewport,c),F(s==="ronnie"?"RONNIE":"TORI",H(s)),m={unmount:()=>{const e=document.getElementById("app");e&&(e.innerHTML=""),l=null}},console.log(`[UV7 V2] Starting game: ${s} route`)}function H(s){return s==="ronnie"?"Day 847. She's still not waking up. The doctors say the same thing every time - 'We're monitoring her condition.' But I know there's something else going on. Something in the code...":"Where am I? The last thing I remember was... pain. Then nothing. Now this void. These numbers streaming past. And his voice, somewhere far away, calling my name..."}function F(s,e){if(!l)return;l.dialogName.textContent=s,l.dialogName.style.color=s==="RONNIE"?"#0ff":"#f0f",l.dialogText.textContent="";let t=0;const i=h.get("textSpeed")||30,n=setInterval(()=>{t<e.length?(l.dialogText.textContent+=e[t],t++):(clearInterval(n),l.dialogText.innerHTML+='<span style="opacity: 0.5; margin-left: 1rem;">▼</span>')},i)}function b(){l&&(g=!g,g?(u=new O(c),u.mount(d)):(u==null||u.unmount(),u=null))}function G(){c.on("ui:route_select",E),c.on("ui:main_menu",y),c.on("ui:settings",V),c.on("ui:credits",$),c.on("ui:load_menu",q),c.on("ui:start_game",s=>{w(s.route)}),c.on("ui:pause_toggle",b),c.on("tether:change",s=>{l&&l.updateTether(s.level)}),document.addEventListener("keydown",s=>{s.key==="Escape"&&l&&b()}),c.on("ui:click",()=>{navigator.vibrate&&navigator.vibrate(10)}),c.on("ui:confirm",()=>{navigator.vibrate&&navigator.vibrate([20,30,20])}),c.on("ui:denied",()=>{navigator.vibrate&&navigator.vibrate([50,20,50])})}async function j(){console.log("[UV7 V2] Starting..."),await v.init(),G(),await P(),y(),typeof window<"u"&&(window.uv7={eventBus:c,stateManager:p,gameEngine:v,settingsSystem:h,version:"V2-beta",showRoute:E,showMenu:y,startGame:w},console.log("[UV7 V2] Debug: window.uv7 available"))}j().catch(console.error);
//# sourceMappingURL=main-DaJPByMi.js.map
