(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();class h{constructor(e=100,t=!0){this.subscribers=new Map,this.history=[],this.maxHistorySize=e,this.historyEnabled=t}on(e,t){return this.subscribers.has(e)||this.subscribers.set(e,new Set),this.subscribers.get(e).add(t),()=>{const s=this.subscribers.get(e);s&&s.delete(t)}}emit(e,t){this.historyEnabled&&(this.history.push({event:e,data:t,timestamp:Date.now()}),this.history.length>this.maxHistorySize&&this.history.shift());const i=this.subscribers.get(e);i&&i.forEach(s=>{try{s(t)}catch(r){console.error(`Error in event callback for ${e}:`,r)}})}off(e,t){const i=this.subscribers.get(e);i&&i.delete(t)}clear(e){e?this.subscribers.delete(e):this.subscribers.clear()}getHistory(){return[...this.history]}clearHistory(){this.history=[]}setHistoryEnabled(e){this.historyEnabled=e}}class f{constructor(e={},t="vn_state"){this.state=this.deepClone(e),this.subscribers=new Map,this.isDirty=!1,this.persistenceKey=t}get(e){const t=this.getByPath(this.state,e);return t!=null&&typeof t=="object"?this.deepClone(t):t}set(e,t){const i=this.deepClone(t),s=this.get(e);this.deepEqual(s,i)||(this.setByPath(this.state,e,i),this.isDirty=!0,this.notifySubscribers(e,i,s))}subscribe(e,t){return this.subscribers.has(e)||this.subscribers.set(e,new Set),this.subscribers.get(e).add(t),()=>{const s=this.subscribers.get(e);s&&s.delete(t)}}save(){if(this.isDirty)try{const e=JSON.stringify(this.state);localStorage.setItem(this.persistenceKey,e),this.isDirty=!1}catch(e){console.error("Failed to save state:",e)}}load(){try{const e=localStorage.getItem(this.persistenceKey);if(!e)return!1;const t=JSON.parse(e);return this.state=t,this.isDirty=!1,this.subscribers.forEach((i,s)=>{const r=this.get(s);i.forEach(o=>{try{o(r,void 0)}catch(n){console.error(`Error in state subscription for ${s}:`,n)}})}),!0}catch(e){return console.error("Failed to load state:",e),!1}}getAll(){return this.deepClone(this.state)}setAll(e){this.state=this.deepClone(e),this.isDirty=!0,this.subscribers.forEach((t,i)=>{const s=this.get(i),r=void 0;t.forEach(o=>{try{o(s,r)}catch(n){console.error(`Error in state subscription for ${i}:`,n)}})})}getByPath(e,t){if(typeof t!="string")return;const i=t.split(".");let s=e;for(const r of i){if(s==null||typeof s!="object")return;s=s[r]}return s}setByPath(e,t,i){const s=t.split("."),r=s.pop();let o=e;for(const n of s)(!(n in o)||typeof o[n]!="object"||o[n]===null)&&(o[n]={}),o=o[n];o[r]=i}notifySubscribers(e,t,i){const s=this.subscribers.get(e);s&&s.forEach(r=>{try{r(t,i)}catch(o){console.error(`Error in state subscription for ${e}:`,o)}})}deepClone(e){if(e===null||typeof e!="object")return e;if(e instanceof Date)return new Date(e.getTime());if(e instanceof Array)return e.map(t=>this.deepClone(t));if(typeof e=="object"){const t={};for(const i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=this.deepClone(e[i]));return t}return e}deepEqual(e,t){if(e===t)return!0;if(e===null||t===null||typeof e!="object"||typeof t!="object")return!1;if(e instanceof Array&&t instanceof Array)return e.length!==t.length?!1:e.every((r,o)=>this.deepEqual(r,t[o]));const i=Object.keys(e),s=Object.keys(t);return i.length!==s.length?!1:i.every(r=>s.includes(r)&&this.deepEqual(e[r],t[r]))}}class y{constructor(e){var t,i;this.currentIndex=0,this.eventBus=e,this.items=[{id:"start",title:"START",icon:"▶️",subtitle:"Begin the cycle",action:"ui:route_select"},{id:"load",title:"LOAD",icon:"📂",subtitle:"Resume timeline",action:"ui:load_menu"},{id:"settings",title:"SETTINGS",icon:"⚙️",subtitle:"Adjust reality",action:"ui:settings"},{id:"credits",title:"CREW",icon:"👥",subtitle:"The UV7 Team",action:"ui:credits"}],this.container=document.createElement("div"),this.container.className="menu-carousel",this.container.innerHTML=`
            <button class="carousel-arrow carousel-prev">◀</button>
            <div class="carousel-viewport">
                <div class="carousel-track"></div>
            </div>
            <button class="carousel-arrow carousel-next">▶</button>
            <div class="carousel-dots"></div>
            <div class="carousel-hint">Press ENTER to Select</div>
        `,this.track=this.container.querySelector(".carousel-track"),(t=this.container.querySelector(".carousel-prev"))==null||t.addEventListener("click",()=>this.prev()),(i=this.container.querySelector(".carousel-next"))==null||i.addEventListener("click",()=>this.next()),this.renderItems()}mount(e){e.appendChild(this.container),this.updateView()}unmount(){this.container.remove()}renderItems(){this.track.innerHTML="",this.items.forEach((t,i)=>{const s=document.createElement("div");s.className=`carousel-card ${t.locked?"locked":""}`,s.dataset.index=i.toString(),s.innerHTML=`
                <div class="card-icon">${t.icon}</div>
                <div class="card-title">${t.title}</div>
                <div class="card-subtitle">${t.subtitle}</div>
                <button class="card-button">${t.locked?"LOCKED":"SELECT"}</button>
            `,s.addEventListener("click",()=>{this.currentIndex===i?this.select():(this.currentIndex=i,this.updateView())}),this.track.appendChild(s)});const e=this.container.querySelector(".carousel-dots");e.innerHTML=this.items.map((t,i)=>`<div class="carousel-dot" data-index="${i}"></div>`).join("")}updateView(){const i=-(this.currentIndex*420);this.track.style.transform=`translateX(${i}px)`,this.track.querySelectorAll(".carousel-card").forEach((o,n)=>{n===this.currentIndex?o.classList.add("card-active"):o.classList.remove("card-active")}),this.container.querySelectorAll(".carousel-dot").forEach((o,n)=>{n===this.currentIndex?o.classList.add("active"):o.classList.remove("active")})}prev(){this.currentIndex>0&&(this.currentIndex--,this.updateView(),this.eventBus.emit("ui:click",{}))}next(){this.currentIndex<this.items.length-1&&(this.currentIndex++,this.updateView(),this.eventBus.emit("ui:click",{}))}select(){const e=this.items[this.currentIndex];e&&(e.locked?this.eventBus.emit("ui:denied",{}):(this.eventBus.emit(e.action,{}),this.eventBus.emit("ui:confirm",{})))}}class p{constructor(e){this.container=document.createElement("div"),this.container.id="main-menu",this.container.className="screen-container",this.container.style.display="flex",this.container.style.flexDirection="column",this.container.style.alignItems="center",this.container.style.justifyContent="center",this.container.style.height="100%",this.container.style.width="100%",this.container.style.background='url("assets/desktopVersion.webp") no-repeat center center/cover',this.container.innerHTML=`
            <div id="main-menu-content" style="text-align: center; z-index: 10;">
                <h1 style="font-size: 4rem; margin-bottom: 0.5rem; text-shadow: 0 0 20px cyan;">VERSION 848</h1>
                <div class="subtitle" style="font-size: 1.2rem; margin-bottom: 2rem; color: #ccc;">My Wife Is in a Coma... and in the Code</div>
            </div>
            <div class="menu-footer" style="position: absolute; bottom: 20px; font-size: 0.8rem; color: #666;">
                [Version 848 - 847 previous failures]
            </div>
        `,this.carousel=new y(e)}mount(e){e.appendChild(this.container);const t=this.container.querySelector("#main-menu-content");this.carousel.mount(t)}unmount(){this.carousel.unmount(),this.container.remove()}}const a=new h,m=new f({currentScene:"none",currentRoute:null,tetherLevel:100,flags:{},history:[],playtime:0}),u=document.getElementById("app");if(!u)throw new Error("No #app element found");let l=null;function b(){return new Promise(c=>{const e=document.createElement("div");e.id="splash-screen",e.style.cssText=`
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
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
                    <div id="boot-line-2" style="opacity: 0;">Loading assets...</div>
                    <div id="boot-line-3" style="opacity: 0;">Establishing tether...</div>
                    <div id="boot-line-4" style="opacity: 0;">Ready.</div>
                </div>
                <div style="margin-top: 2rem;">
                    <div style="width: 200px; height: 4px; background: #333; border-radius: 2px; overflow: hidden;">
                        <div id="progress-bar" style="width: 0%; height: 100%; background: #0f0; transition: width 0.3s;"></div>
                    </div>
                </div>
            </div>
        `,u.appendChild(e);const t=e.querySelector("#progress-bar"),i=[e.querySelector("#boot-line-2"),e.querySelector("#boot-line-3"),e.querySelector("#boot-line-4")];let s=0;const r=setInterval(()=>{s+=Math.random()*15+5,s>=100&&(s=100,clearInterval(r)),t.style.width=`${s}%`,s>25&&i[0]&&(i[0].style.opacity="1"),s>50&&i[1]&&(i[1].style.opacity="1"),s>75&&i[2]&&(i[2].style.opacity="1"),s>=100&&setTimeout(()=>{e.style.transition="opacity 0.5s",e.style.opacity="0",setTimeout(()=>{e.remove(),c()},500)},500)},150)})}function d(){l&&l.unmount();const c=new p(a);c.mount(u),l=c,console.log("[UV7 V2] Main Menu loaded")}function v(){a.on("ui:route_select",()=>{console.log("[UV7 V2] Route select requested")}),a.on("ui:load_menu",()=>{console.log("[UV7 V2] Load menu requested")}),a.on("ui:settings",()=>{console.log("[UV7 V2] Settings requested")}),a.on("ui:credits",()=>{console.log("[UV7 V2] Credits requested")}),a.on("ui:main_menu",()=>{d()})}async function g(){console.log("[UV7 V2] Starting..."),v(),await b(),d(),typeof window<"u"&&(window.uv7={eventBus:a,stateManager:m,version:"V2-alpha"},console.log("[UV7 V2] Debug: window.uv7 available"))}g().catch(console.error);
//# sourceMappingURL=main-BZs08eqA.js.map
