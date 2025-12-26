var S=r=>{throw TypeError(r)};var O=(r,e,t)=>e.has(r)||S("Cannot "+t);var w=(r,e,t)=>e.has(r)?S("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(r):e.set(r,t);var c=(r,e,t)=>(O(r,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();const k="stm_data_";var a,u,L,y,f;class m{constructor(e=""){w(this,a);this.sheet=e,this.scriptGoogleUrl="https://script.google.com/macros/s/",this.idSheet="AKfycbzEOzJtIfjKSDgSZftW-kq1Szxdqkait9x8SR7zzd71s3kDTo8n_bLgSDkhKo_c9tad",this.execSheet="/exec?sheet=",this.keyStorage=k+this.sheet}async get(){const e=c(this,a,f).call(this);if(e)return e;const t=c(this,a,u).call(this,this.sheet),i=await fetch(t);if(!i.ok)throw new Error("GET error");const s=await i.json();return s&&c(this,a,y).call(this,s),s}async getByCongregation(e){const t=c(this,a,f).call(this,e);if(t)return t;const i=c(this,a,L).call(this,e),s=await fetch(i);if(!s.ok)throw new Error("GET error");const o=await s.json();return o&&c(this,a,y).call(this,o,e),o}async post(e,t){const i=await fetch(`${c(this,a,u).call(this,this.sheet)}&method=${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!i.ok)throw new Error("POST error");return i.json()}clearStorage(e=null){const t=e?`${this.keyStorage}_${e}`:this.keyStorage;localStorage.removeItem(t)}}a=new WeakSet,u=function(e){const t=e||this.sheet;if(!t)throw new Error("Sheet name not defined");return`${this.scriptGoogleUrl}${this.idSheet}${this.execSheet}${t}`},L=function(e){if(!e)throw new Error("Congregation Number not defined");return`${c(this,a,u).call(this,this.sheet)}&congregation_number=${e}`},y=function(e,t=null){const i=t?`${this.keyStorage}_${t}`:this.keyStorage;localStorage.setItem(i,JSON.stringify(e))},f=function(e=null){const t=e?`${this.keyStorage}_${e}`:this.keyStorage,i=localStorage.getItem(t);return i?JSON.parse(i):null};class B extends m{constructor(){super("congregation")}}class T extends m{constructor(){super("user")}}class R extends m{constructor(){super("territory")}}class _ extends m{constructor(){super("address")}}const h="stm_logged_user";class A{constructor(){this.userService=new T,this.territoryService=new R,this.addressService=new _}async login(e,t,i){const s=await this.userService.getByCongregation(e);if(!Array.isArray(s))return null;const o=s.find(n=>String(n.congregation_number)===String(e)&&n.user===t&&String(n.password)===i&&n.active===!0);return o?(this.saveUser(o),o):null}saveUser(e){localStorage.setItem(h,JSON.stringify(e))}getLoggedUser(){const e=localStorage.getItem(h);return e?JSON.parse(e):null}isLogged(){return!!this.getLoggedUser()}logout(){this.userService.clearStorage(),this.territoryService.clearStorage(),this.addressService.clearStorage(),localStorage.removeItem(h)}}function E(r=null,e="Loading..."){if(r)r.innerHTML=`
      <div class="d-flex flex-column justify-content-center align-items-center text-center"
           style="height: 100%; min-height: 200px;">
        <img src="./assets/logo.png" alt="Logo" style="max-width:120px; margin-bottom:20px;">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="fw-bold text-primary">${e}</div>
      </div>
    `;else{let t=document.getElementById("app-loading-overlay");t||(t=document.createElement("div"),t.id="app-loading-overlay",t.style.position="fixed",t.style.top=0,t.style.left=0,t.style.width="100%",t.style.height="100%",t.style.background="rgba(255,255,255,0.8)",t.style.display="flex",t.style.flexDirection="column",t.style.justifyContent="center",t.style.alignItems="center",t.style.zIndex=9999,document.body.appendChild(t)),t.innerHTML=`
      <img src="./assets/logo.png" alt="Logo" style="max-width:120px; margin-bottom:20px;">
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="fw-bold text-primary">${e}</div>
    `}}function p(r=null){if(r)r.innerHTML="";else{const e=document.getElementById("app-loading-overlay");e&&e.remove()}}function b({type:r="INFO",message:e="",okLabel:t="OK",onOk:i=null,enableNegativeButton:s=!1,noLabel:o="No"}){const n=document.getElementById("app-dialog-overlay");n&&n.remove();const l={INFO:{color:"primary",icon:"bi-info-circle-fill"},ERROR:{color:"danger",icon:"bi-x-octagon-fill"},ALERT:{color:"warning",icon:"bi-exclamation-triangle-fill"}},{color:d,icon:I}=l[r]||l.INFO,g=document.createElement("div");g.id="app-dialog-overlay",g.className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center",g.style.background="rgba(0,0,0,0.5)",g.style.zIndex="1055",g.innerHTML=`
    <div class="card shadow border-0" style="width: 380px;">
      <div class="card-body p-4">

        <div class="text-center mb-3 text-${d}">
          <i class="bi ${I}" style="font-size: 3rem;"></i>
        </div>

        <div class="text-center fw-bold text-${d} mb-2">
          ${r}
        </div>

        <div class="text-center text-secondary mb-4">
          ${e}
        </div>

        <div class="d-flex justify-content-end gap-2">
          ${s?`<button id="dialogNoBtn" class="btn btn-outline-danger">
                   <i class="bi bi-x-circle me-1"></i> ${o}
                 </button>`:""}

          <button id="dialogOkBtn" class="btn btn-primary">
            <i class="bi bi-check-circle me-1"></i> ${t}
          </button>
        </div>

      </div>
    </div>
  `,document.body.appendChild(g);const v=()=>g.remove();document.getElementById("dialogOkBtn").addEventListener("click",()=>{v(),typeof i=="function"&&i()}),s&&document.getElementById("dialogNoBtn").addEventListener("click",v)}const x=document.getElementById("loginContainer"),$=new A;async function U(){if($.isLogged()){window.location.href="./src/pages/home.html";return}await C()}async function C(r){E(x,"STM - Loading data...");const t=await new B().get();x.innerHTML=`
          <div class="card p-4 shadow" style="width: 360px;">
            <div class="text-center mb-3">
              <img src="./assets/logo.png" alt="Logo" style="max-width:120px;">
            </div>

            <h4 class="text-center text-primary mb-4">Login</h4>

            <div class="mb-3">
              <select id="congregation" class="form-select">
                <option value="">Select a congregation</option>
                ${t.map(i=>`<option value="${i.number}">${i.name} (${i.city})</option>`).join("")}
              </select>
              <div class="invalid-feedback">Congregation is required</div>
            </div>

            <div class="mb-3">
              <input type="text" id="username" class="form-control" placeholder="Username">
              <div class="invalid-feedback">Username is required</div>
            </div>

            <div class="mb-3">
              <input type="password" id="password" class="form-control" placeholder="Password">
              <div class="invalid-feedback">Password is required</div>
            </div>

            <button id="loginBtn" class="btn btn-primary w-100">
              <i class="bi bi-box-arrow-in-right me-2"></i> Login
            </button>
          </div>
        `,p(),j()}function j(r){document.getElementById("loginBtn").addEventListener("click",async()=>{const e=document.getElementById("congregation"),t=document.getElementById("username"),i=document.getElementById("password"),s=e.value,o=t.value.trim(),n=i.value.trim();[e,t,i].forEach(d=>d.classList.remove("is-invalid"));let l=!0;if(s||(e.classList.add("is-invalid"),l=!1),o||(t.classList.add("is-invalid"),l=!1),n||(i.classList.add("is-invalid"),l=!1),!!l){E(null,"Login...");try{const d=await $.login(s,o,n);p(),d?window.location.href="./home.html":b({type:"ERROR",message:"Login failed - Invalid credentials"})}catch{p(),b({type:"ERROR",message:"An error occurred while logging in."})}}})}U();
