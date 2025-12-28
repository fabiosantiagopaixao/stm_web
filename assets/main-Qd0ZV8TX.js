import{L as p,s as u,C as y,h as r}from"./loading-Dc4beW_t.js";function m({type:d="INFO",message:a="",okLabel:i="OK",onOk:e=null,enableNegativeButton:s=!1,noLabel:l="No"}){const c=document.getElementById("app-dialog-overlay");c&&c.remove();const n={INFO:{color:"primary",icon:"bi-info-circle-fill"},ERROR:{color:"danger",icon:"bi-x-octagon-fill"},ALERT:{color:"warning",icon:"bi-exclamation-triangle-fill"}},{color:t,icon:b}=n[d]||n.INFO,o=document.createElement("div");o.id="app-dialog-overlay",o.className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center",o.style.background="rgba(0,0,0,0.5)",o.style.zIndex="1055",o.innerHTML=`
    <div class="card shadow border-0" style="width: 380px;">
      <div class="card-body p-4">

        <div class="text-center mb-3 text-${t}">
          <i class="bi ${b}" style="font-size: 3rem;"></i>
        </div>

        <div class="text-center fw-bold text-${t} mb-2">
          ${d}
        </div>

        <div class="text-center text-secondary mb-4">
          ${a}
        </div>

        <div class="d-flex justify-content-end gap-2">
          ${s?`<button id="dialogNoBtn" class="btn btn-outline-danger">
                   <i class="bi bi-x-circle me-1"></i> ${l}
                 </button>`:""}

          <button id="dialogOkBtn" class="btn btn-primary">
            <i class="bi bi-check-circle me-1"></i> ${i}
          </button>
        </div>

      </div>
    </div>
  `,document.body.appendChild(o);const g=()=>o.remove();document.getElementById("dialogOkBtn").addEventListener("click",()=>{g(),typeof e=="function"&&e()}),s&&document.getElementById("dialogNoBtn").addEventListener("click",g)}const v=document.getElementById("loginContainer"),f=new p;async function w(){if(f.isLogged()){window.location.href="home.html";return}await h()}async function h(d){u(v,"STM - Loading data...");const i=await new y().get();v.innerHTML=`
          <div class="card p-4 shadow" style="width: 360px;">
            <div class="text-center mb-3">
              <img src="/stm_web/img/logo.png" alt="Logo" style="max-width:120px;">
            </div>

            <h4 class="text-center text-primary mb-4">Login</h4>

            <div class="mb-3">
              <select id="congregation" class="form-select">
                <option value="">Select a congregation</option>
                ${i.map(e=>`<option value="${e.number}">${e.name} (${e.city})</option>`).join("")}
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
        `,r(),x()}function x(d){document.getElementById("loginBtn").addEventListener("click",async()=>{const a=document.getElementById("congregation"),i=document.getElementById("username"),e=document.getElementById("password"),s=a.value,l=i.value.trim(),c=e.value.trim();[a,i,e].forEach(t=>t.classList.remove("is-invalid"));let n=!0;if(s||(a.classList.add("is-invalid"),n=!1),l||(i.classList.add("is-invalid"),n=!1),c||(e.classList.add("is-invalid"),n=!1),!!n){u(null,"Login...");try{const t=await f.login(s,l,c);r(),t?window.location.href="./home.html":m({type:"ERROR",message:"Login failed - Invalid credentials"})}catch{r(),m({type:"ERROR",message:"An error occurred while logging in."})}}})}w();
