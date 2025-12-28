import{L as b,s as u,C as y,h as r}from"./loading-Dc4beW_t.js";function m({type:l="INFO",message:c="",okLabel:t="OK",onOk:i=null,enableNegativeButton:e=!1,noLabel:n="No"}){const d=document.getElementById("app-dialog-overlay");d&&d.remove();const o={INFO:{color:"primary",icon:"bi-info-circle-fill"},ERROR:{color:"danger",icon:"bi-x-octagon-fill"},ALERT:{color:"warning",icon:"bi-exclamation-triangle-fill"}},{color:a,icon:p}=o[l]||o.INFO,s=document.createElement("div");s.id="app-dialog-overlay",s.className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center",s.style.background="rgba(0,0,0,0.5)",s.style.zIndex="1055",s.innerHTML=`
    <div class="card shadow border-0" style="width: 380px;">
      <div class="card-body p-4">

        <div class="text-center mb-3 text-${a}">
          <i class="bi ${p}" style="font-size: 3rem;"></i>
        </div>

        <div class="text-center fw-bold text-${a} mb-2">
          ${l}
        </div>

        <div class="text-center text-secondary mb-4">
          ${c}
        </div>

        <div class="d-flex justify-content-end gap-2">
          ${e?`<button id="dialogNoBtn" class="btn btn-outline-danger">
                   <i class="bi bi-x-circle me-1"></i> ${n}
                 </button>`:""}

          <button id="dialogOkBtn" class="btn btn-primary">
            <i class="bi bi-check-circle me-1"></i> ${t}
          </button>
        </div>

      </div>
    </div>
  `,document.body.appendChild(s);const g=()=>s.remove();document.getElementById("dialogOkBtn").addEventListener("click",()=>{g(),typeof i=="function"&&i()}),e&&document.getElementById("dialogNoBtn").addEventListener("click",g)}const w="/stm_web/assets/logo-Crpf6SNW.png",v=document.getElementById("loginContainer"),f=new b;async function h(){if(f.isLogged()){window.location.href="home.html";return}await x()}async function x(l){u(v,"STM - Loading data...");const t=await new y().get();v.innerHTML=`
          <div class="card p-4 shadow" style="width: 360px;">
            <div id="logoContainer" class="text-center mb-3"></div>

            <h4 class="text-center text-primary mb-4">Login</h4>

            <div class="mb-3">
              <select id="congregation" class="form-select">
                <option value="">Select a congregation</option>
                ${t.map(n=>`<option value="${n.number}">${n.name} (${n.city})</option>`).join("")}
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
        `;const i=document.getElementById("logoContainer"),e=document.createElement("img");e.src=w,e.alt="Logo",e.style.maxWidth="120px",i.appendChild(e),r(),L()}function L(l){document.getElementById("loginBtn").addEventListener("click",async()=>{const c=document.getElementById("congregation"),t=document.getElementById("username"),i=document.getElementById("password"),e=c.value,n=t.value.trim(),d=i.value.trim();[c,t,i].forEach(a=>a.classList.remove("is-invalid"));let o=!0;if(e||(c.classList.add("is-invalid"),o=!1),n||(t.classList.add("is-invalid"),o=!1),d||(i.classList.add("is-invalid"),o=!1),!!o){u(null,"Login...");try{const a=await f.login(e,n,d);r(),a?window.location.href="./home.html":m({type:"ERROR",message:"Login failed - Invalid credentials"})}catch{r(),m({type:"ERROR",message:"An error occurred while logging in."})}}})}h();
