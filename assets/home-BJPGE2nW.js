import{s as u,C as Y,L as p,h as g,U as h,T as W,A as I}from"./loading-Dc4beW_t.js";function X(){document.getElementById("pageTitle").innerText="Home",document.getElementById("card-data").innerHTML=`
    <div class="container mt-5">
      <div class="text-center">
        <h1 class="display-4 mb-3">Welcome to STM - Admin Panel</h1>
        <p class="lead">Select a menu option from the sidebar to start managing data.</p>
      </div>
    </div>
  `}function y({container:e,columns:a,data:t,onView:l,onEdit:s,onDelete:i,disableEdit:n=!1,disableDelete:m=!1,rowsOptions:v=[15,30,60,100]}){let r=1,d=v[0];function b(c){return c===!0?`
        <span class="text-success" title="Activo">
          <i class="fas fa-check-circle"></i>
        </span>
      `:c===!1?`
        <span class="text-danger" title="Inactivo">
          <i class="fas fa-times-circle"></i>
        </span>
      `:c??""}function A(c){return typeof c=="boolean"}function T(c){return(c==null?void 0:c.toLowerCase())==="activo"?"text-center":""}function f(){const c=t.length,S=Math.ceil(c/d),L=(r-1)*d,x=Math.min(L+d,c),w=t.slice(L,x);e.innerHTML=`
      <div class="card shadow mb-4">
        <div class="card-body">

          <!-- Rows per page -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              Show
              <select id="rowsPerPage" class="form-select form-select-sm d-inline w-auto">
                ${v.map(o=>`
                  <option value="${o}" ${o===d?"selected":""}>
                    ${o}
                  </option>
                `).join("")}
              </select>
              entries
            </div>
          </div>

          <!-- Table -->
          <div class="table-responsive">
            <table id="dataTable" class="table table-bordered table-hover">
              <thead>
                <tr>
                  ${a.map(o=>`
                    <th class="${T(o.label)}">
                      ${o.label}
                    </th>
                  `).join("")}
                  <th class="text-end" style="width:140px">Actions</th>
                </tr>
              </thead>

              <tbody>
                ${w.map(o=>`
                  <tr>
                    ${a.map(C=>`
                      <td class="${A(o[C.key])?"text-center":""}">
                        ${b(o[C.key])}
                      </td>
                    `).join("")}

                    <td class="text-end text-nowrap">

                      <!-- View -->
                      ${l?`
                        <a href="#"
                           class="btn btn-info btn-circle btn-sm"
                           data-id="${o.id}"
                           data-action="view">
                          <i class="fas fa-eye"></i>
                        </a>
                      `:""}

                      <!-- Edit -->
                      ${s&&!n?`
                        <a href="#"
                           class="btn btn-warning btn-circle btn-sm"
                           data-id="${o.id}"
                           data-action="edit">
                          <i class="fas fa-edit"></i>
                        </a>
                      `:""}

                      <!-- Delete -->
                      ${i&&!m?`
                        <a href="#"
                           class="btn btn-danger btn-circle btn-sm"
                           data-id="${o.id}"
                           data-action="delete">
                          <i class="fas fa-trash"></i>
                        </a>
                      `:""}

                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div class="row align-items-center mt-3">
            <div class="col-md-5">
              <div class="dataTables_info">
                Showing ${L+1} to ${x} of ${c} entries
              </div>
            </div>

            <div class="col-md-7">
              <ul class="pagination justify-content-end mb-0" id="pagination"></ul>
            </div>
          </div>

        </div>
      </div>
    `,e.querySelector("#rowsPerPage").addEventListener("change",o=>{d=Number(o.target.value),r=1,f()});const k=e.querySelector("#pagination");k.innerHTML="",k.appendChild(E("Previous",r===1,()=>{r--,f()}));for(let o=1;o<=S;o++)k.appendChild(E(o,o===r,()=>{r=o,f()}));k.appendChild(E("Next",r===S,()=>{r++,f()})),e.querySelectorAll("a[data-action]").forEach(o=>{o.addEventListener("click",C=>{if(C.preventDefault(),o.classList.contains("disabled"))return;const U=o.dataset.action,G=o.dataset.id,q=t.find(z=>z.id==G);U==="view"&&l&&l(q),U==="edit"&&s&&s(q),U==="delete"&&i&&i(q)})})}function E(c,S,L){const x=document.createElement("li");x.className=`page-item ${S?"disabled":""} ${c===r?"active":""}`;const w=document.createElement("a");return w.href="#",w.className="page-link",w.textContent=c,w.addEventListener("click",k=>{k.preventDefault(),S||L()}),x.appendChild(w),x}f()}async function K(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Congregations",u(e,"Loading Congregations...");const a=new Y,l=new p().getLoggedUser(),s=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"id",label:"ID",width:"50px"},{key:"number",label:"Number",width:"80px"},{key:"name",label:"Name",width:"200px"},{key:"city",label:"City",width:"150px"},{key:"active",label:"Active",width:"80px"}],data:s,rowsOptions:[15,30,60,100,150],onEdit:i=>alert("Edit Congregation "+i),onDelete:i=>{confirm("Are you sure you want to delete congregation "+i+"?")&&alert("Deleted Congregation "+i)}})}function D(e,a,t=!1){document.getElementById("card-data");let l=t?"View User":"Edit User";l=l+" - "+a.name,document.getElementById("pageTitle").innerText=l,e.innerHTML=`
    <div class="card shadow mb-4">
     
      <div class="card-body">
        <form id="userForm">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="congregation_name" class="form-label">Congregation Name</label>
              <input type="text" class="form-control" id="congregation_name" value="${a.congregation_name}" ${t?"disabled":""}>
            </div>
            <div class="col-md-6">
              <label for="name" class="form-label">Name</label>
              <input type="text" class="form-control" id="name" value="${a.name}" ${t?"disabled":""}>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="user" class="form-label">Usuario</label>
              <input type="text" class="form-control" id="user" value="${a.user}" ${t?"disabled":""}>
            </div>
            <div class="col-md-6">
              <label for="password" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="password" value="${a.password}" ${t?"disabled":""}>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="type" class="form-label">Type</label>
              <input type="text" class="form-control" id="type" value="${a.type}" ${t?"disabled":""}>
            </div>
            <div class="col-md-6 d-flex align-items-center">
              <div class="form-check mt-4">
                <input class="form-check-input" type="checkbox" id="active" ${a.active?"checked":""} ${t?"disabled":""}>
                <label class="form-check-label" for="active">
                  Activo
                </label>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="row mt-4">
            <div class="col-md-12 d-flex justify-content-end gap-2">
              ${t?"":`
              <button type="submit" class="btn btn-primary" style="margin-right: 10px">
                <i class="fas fa-save"></i> Salvar
              </button>`}
              <button type="button" class="btn btn-success" id="btnBack">
                <i class="fas fa-arrow-left"></i> Voltar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;const s=e.querySelector("#userForm");s.addEventListener("submit",async i=>{if(i.preventDefault(),t)return;const n={id:a.id,congregation_name:s.querySelector("#congregation_name").value,name:s.querySelector("#name").value,user:s.querySelector("#user").value,password:s.querySelector("#password").value,type:s.querySelector("#type").value,active:s.querySelector("#active").checked};u(e,"Saving user..."),await new h().update(n),g(e),alert("User saved successfully!")}),e.querySelector("#btnBack").addEventListener("click",()=>{window.history.back()})}const J=document.getElementById("card-data"),Q={id:2,congregation_name:"Cerro Rico Lenguaje de Señas",name:"Sup. Circuito",user:"super_circuito",password:"1234560",type:"CIRCUIT_OVERSEER",active:!0};D(J,Q,!1);function O(e,a={}){const{id:t="alertModal",type:l="INFO",title:s="Attention",message:i="",buttons:n=[{text:"OK",className:"btn btn-primary",dismiss:!0}]}=a,m=document.getElementById(t);m&&m.remove();let v="";switch(l.toUpperCase()){case"ERROR":v='<i class="fas fa-times-circle text-danger fa-2x mr-2"></i>';break;case"WARNING":v='<i class="fas fa-exclamation-triangle text-warning fa-2x mr-2"></i>';break;case"INFO":default:v='<i class="fas fa-info-circle text-primary fa-2x mr-2"></i>';break}const r=document.createElement("div");return r.className="modal fade",r.id=t,r.tabIndex=-1,r.setAttribute("role","dialog"),r.innerHTML=`
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${v}${s}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">${i}</div>
        <div class="modal-footer">
          ${n.map((d,b)=>`
            <button type="button" class="${d.className}" id="${t}-btn-${b}" ${d.dismiss?'data-dismiss="modal"':""}>
              ${d.text}
            </button>
          `).join("")}
        </div>
      </div>
    </div>
  `,e.appendChild(r),n.forEach((d,b)=>{d.action&&document.getElementById(`${t}-btn-${b}`).addEventListener("click",d.action)}),$(`#${t}`)}const Z=["PUBLISHER","ADMINISTRATOR","CIRCUIT_OVERSEER","AUXILIARY"];function M(e){return{PUBLISHER:"Publicador",ADMINISTRATOR:"Administrador",CIRCUIT_OVERSEER:"Superintendente de circuito",AUXILIARY:"Auxiliar"}[e]||e}function _(e){e.classList.add("is-invalid")}function ee(e){e.classList.remove("is-invalid")}function B(e,a=null,t=!1){let l=a=null;const s=a||{name:"",user:"",password:"",type:"PUBLISHER",active:!0};document.getElementById("pageTitle").innerText=`${t?"View User":l?"Create User":"Edit User"} - ${s.name}`,e.innerHTML=`
    <div class="card shadow mb-4">
      <div class="card-body">
        <form id="userForm" novalidate>

          <!-- Name / User -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-control" id="name" placeholder="Insira su Nombre"
                     value="${s.name}" ${t?"disabled":""}>
              <div class="invalid-feedback">El nombre es obligatorio</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Usuario</label>
              <input type="text" class="form-control" id="user" placeholder="Insira su Usuario"
                     value="${s.user}" ${t?"disabled":""}>
              <div class="invalid-feedback">El usuario es obligatorio</div>
            </div>
          </div>

          <!-- Password -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="password" placeholder="Insira su Contraseña"
                     value="${s.password}" ${t?"disabled":""}>
              <div class="invalid-feedback">La contraseña es obligatoria</div>
            </div>
          </div>

          <!-- Type / Active -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Type</label>
              <div class="mt-2" id="typeGroup">
                ${Z.map(n=>`
                  <div class="form-check">
                    <input class="form-check-input"
                           type="radio"
                           name="type"
                           id="type_${n}"
                           value="${n}"
                           ${s.type===n?"checked":""}
                           ${t?"disabled":""}>
                    <label class="form-check-label" for="type_${n}">
                      ${M(n)}
                    </label>
                  </div>
                `).join("")}
                <div class="invalid-feedback" id="typeError">
                  El tipo de usuario es obligatorio
                </div>
              </div>
            </div>

            <div class="col-md-6 d-flex align-items-center">
              <div class="form-check mt-4">
                <input class="form-check-input" type="checkbox" id="active"
                       ${s.active?"checked":""}
                       ${t?"disabled":""}>
                <label class="form-check-label" for="active">
                  Activo
                </label>
                <div class="invalid-feedback">
                  Debe estar activo
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="row mt-4">
            <div class="col-md-12 d-flex justify-content-end gap-2">
              ${t?"":`
               <button type="submit" class="btn btn-primary" style="margin-right: 10px">
                  <i class="fas fa-save"></i> Salvar
                </button>
              `}
              <button type="button" class="btn btn-success" id="btnBack">
                <i class="fas fa-arrow-left"></i> Voltar
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  `;const i=e.querySelector("#userForm");i.addEventListener("submit",async n=>{if(n.preventDefault(),t)return;let m=!1;const v=i.querySelector("#name"),r=i.querySelector("#user"),d=i.querySelector("#password"),b=i.querySelector("#active"),A=i.querySelector('input[name="type"]:checked'),T=i.querySelector("#typeError");if([v,r,d,b].forEach(ee),T.style.display="none",v.value.trim()||(_(v),m=!0),r.value.trim()||(_(r),m=!0),d.value.trim()||(_(d),m=!0),A||(T.style.display="block",m=!0),b.checked||(_(b),m=!0),m)return;const f=new p,E={id:s.id??null,name:v.value.trim(),user:r.value.trim(),password:d.value.trim(),type:A.value,active:b.checked,congregation_number:f.getLoggedUser().congregation_number};u(null,"Saving user...");try{await new h().saveUpdate(E),O(document.body,{type:"INFO",title:"Info",message:"Usuário salvo com sucesso!"}).modal("show"),N()}catch(c){console.error("Error saving user:",c),O(document.body,{type:"ERROR",title:"Error",message:"Ocorreu um erro ao salvar usuário!"}).modal("show")}finally{g()}}),e.querySelector("#btnBack").addEventListener("click",()=>{N()})}async function N(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Users";const a=document.getElementById("actionsButtons");if(a){a.innerHTML="";const n=document.createElement("button");n.className="btn btn-primary mb-3",n.innerHTML='<i class="fas fa-plus"></i> Adicionar',a.appendChild(n),n.addEventListener("click",()=>{B(e,null,!1)})}u(e,"Loading Users...");const t=new h,s=new p().getLoggedUser(),i=await t.getByCongregation(s.congregation_number);g(e),y({container:e,columns:[{key:"name",label:"Name",width:"150px"},{key:"user",label:"Usuario",width:"100px"},{key:"password",label:"Contraseña",width:"100px"},{key:"active",label:"Activo",width:"80px"}],data:i,rowsOptions:[15,30,60,100,150],disableDelete:!0,onView:n=>B(e,n,!0),onEdit:n=>B(e,n,!1),onDelete:n=>{confirm("Are you sure you want to delete user "+n+"?")&&alert("Deleted User "+n)}})}async function te(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Territories",u(e,"Loading Territories...");const a=new W,l=new p().getLoggedUser(),s=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"id",label:"ID",width:"20px"},{key:"number",label:"Number",width:"20px"},{key:"name",label:"Name"}],data:s,rowsOptions:[15,30,60,100,150],onEdit:i=>alert("Edit Territory "+i),onDelete:i=>{confirm("Are you sure you want to delete territory "+i+"?")&&alert("Deleted Territory "+i)}})}function V(e,a,t=!1){document.getElementById("card-data");let l=t?"View User":"Edit User";l=l+" - "+a.name,document.getElementById("pageTitle").innerText=l,e.innerHTML=`
    <div class="card shadow mb-4">
     
      <div class="card-body">
        <form id="userForm">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="congregation_name" class="form-label">Congregation Name</label>
              <input type="text" class="form-control" id="congregation_name" value="${a.congregation_name}" ${t?"disabled":""}>
            </div>
            <div class="col-md-6">
              <label for="name" class="form-label">Name</label>
              <input type="text" class="form-control" id="name" value="${a.name}" ${t?"disabled":""}>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="user" class="form-label">Usuario</label>
              <input type="text" class="form-control" id="user" value="${a.user}" ${t?"disabled":""}>
            </div>
            <div class="col-md-6">
              <label for="password" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="password" value="${a.password}" ${t?"disabled":""}>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="type" class="form-label">Type</label>
              <input type="text" class="form-control" id="type" value="${a.type}" ${t?"disabled":""}>
            </div>
            <div class="col-md-6 d-flex align-items-center">
              <div class="form-check mt-4">
                <input class="form-check-input" type="checkbox" id="active" ${a.active?"checked":""} ${t?"disabled":""}>
                <label class="form-check-label" for="active">
                  Activo
                </label>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="row mt-4">
            <div class="col-md-12 d-flex justify-content-end gap-2">
              ${t?"":`
              <button type="submit" class="btn btn-primary" style="margin-right: 10px">
                <i class="fas fa-save"></i> Salvar
              </button>`}
              <button type="button" class="btn btn-success" id="btnBack">
                <i class="fas fa-arrow-left"></i> Voltar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;const s=e.querySelector("#userForm");s.addEventListener("submit",async i=>{if(i.preventDefault(),t)return;const n={id:a.id,congregation_name:s.querySelector("#congregation_name").value,name:s.querySelector("#name").value,user:s.querySelector("#user").value,password:s.querySelector("#password").value,type:s.querySelector("#type").value,active:s.querySelector("#active").checked};u(e,"Saving user..."),await new h().update(n),g(e),alert("User saved successfully!")}),e.querySelector("#btnBack").addEventListener("click",()=>{window.history.back()})}const ae=document.getElementById("card-data"),se={id:2,congregation_name:"Cerro Rico Lenguaje de Señas",name:"Sup. Circuito",user:"super_circuito",password:"1234560",type:"CIRCUIT_OVERSEER",active:!0};V(ae,se,!1);async function ie(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Addresses",u(e,"Loading Addresses...");const a=new I,l=new p().getLoggedUser(),s=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"id",label:"ID",width:"50px"},{key:"congregation_number",label:"Congregation",width:"80px"},{key:"name",label:"Name",width:"200px"},{key:"address",label:"Address",width:"300px"},{key:"gender",label:"Gender",width:"80px"},{key:"age_type",label:"Age Type",width:"100px"},{key:"deaf",label:"Deaf",width:"60px"},{key:"mute",label:"Mute",width:"60px"},{key:"blind",label:"Blind",width:"60px"},{key:"sign",label:"Sign",width:"60px"},{key:"phone",label:"Phone",width:"150px"}],data:s,rowsOptions:[15,30,60,100,150],onEdit:i=>alert("Edit Address "+i),onDelete:i=>{confirm("Are you sure you want to delete address "+i+"?")&&alert("Deleted Address "+i)}})}function H(e,a,t=!1){document.getElementById("card-data");let l=t?"View User":"Edit User";l=l+" - "+a.name,document.getElementById("pageTitle").innerText=l,e.innerHTML=`
    <div class="card shadow mb-4">
     
      <div class="card-body">
        <form id="userForm">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="congregation_name" class="form-label">Congregation Name</label>
              <input type="text" class="form-control" id="congregation_name" value="${a.congregation_name}" ${t?"disabled":""}>
            </div>
            <div class="col-md-6">
              <label for="name" class="form-label">Name</label>
              <input type="text" class="form-control" id="name" value="${a.name}" ${t?"disabled":""}>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="user" class="form-label">Usuario</label>
              <input type="text" class="form-control" id="user" value="${a.user}" ${t?"disabled":""}>
            </div>
            <div class="col-md-6">
              <label for="password" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="password" value="${a.password}" ${t?"disabled":""}>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="type" class="form-label">Type</label>
              <input type="text" class="form-control" id="type" value="${a.type}" ${t?"disabled":""}>
            </div>
            <div class="col-md-6 d-flex align-items-center">
              <div class="form-check mt-4">
                <input class="form-check-input" type="checkbox" id="active" ${a.active?"checked":""} ${t?"disabled":""}>
                <label class="form-check-label" for="active">
                  Activo
                </label>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="row mt-4">
            <div class="col-md-12 d-flex justify-content-end gap-2">
              ${t?"":`
              <button type="submit" class="btn btn-primary" style="margin-right: 10px">
                <i class="fas fa-save"></i> Salvar
              </button>`}
              <button type="button" class="btn btn-success" id="btnBack">
                <i class="fas fa-arrow-left"></i> Voltar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;const s=e.querySelector("#userForm");s.addEventListener("submit",async i=>{if(i.preventDefault(),t)return;const n={id:a.id,congregation_name:s.querySelector("#congregation_name").value,name:s.querySelector("#name").value,user:s.querySelector("#user").value,password:s.querySelector("#password").value,type:s.querySelector("#type").value,active:s.querySelector("#active").checked};u(e,"Saving user..."),await new h().update(n),g(e),alert("User saved successfully!")}),e.querySelector("#btnBack").addEventListener("click",()=>{window.history.back()})}const le=document.getElementById("card-data"),ne={id:2,congregation_name:"Cerro Rico Lenguaje de Señas",name:"Sup. Circuito",user:"super_circuito",password:"1234560",type:"CIRCUIT_OVERSEER",active:!0};H(le,ne,!1);function R(e,a,t=!1){document.getElementById("card-data");let l=t?"View User":"Edit User";l=l+" - "+a.name,document.getElementById("pageTitle").innerText=l,e.innerHTML=`
    <div class="card shadow mb-4">
     
      <div class="card-body">
        <form id="userForm">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="congregation_name" class="form-label">Congregation Name</label>
              <input type="text" class="form-control" id="congregation_name" value="${a.congregation_name}" ${t?"disabled":""}>
            </div>
            <div class="col-md-6">
              <label for="name" class="form-label">Name</label>
              <input type="text" class="form-control" id="name" value="${a.name}" ${t?"disabled":""}>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="user" class="form-label">Usuario</label>
              <input type="text" class="form-control" id="user" value="${a.user}" ${t?"disabled":""}>
            </div>
            <div class="col-md-6">
              <label for="password" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="password" value="${a.password}" ${t?"disabled":""}>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="type" class="form-label">Type</label>
              <input type="text" class="form-control" id="type" value="${a.type}" ${t?"disabled":""}>
            </div>
            <div class="col-md-6 d-flex align-items-center">
              <div class="form-check mt-4">
                <input class="form-check-input" type="checkbox" id="active" ${a.active?"checked":""} ${t?"disabled":""}>
                <label class="form-check-label" for="active">
                  Activo
                </label>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="row mt-4">
            <div class="col-md-12 d-flex justify-content-end gap-2">
              ${t?"":`
              <button type="submit" class="btn btn-primary" style="margin-right: 10px">
                <i class="fas fa-save"></i> Salvar
              </button>`}
              <button type="button" class="btn btn-success" id="btnBack">
                <i class="fas fa-arrow-left"></i> Voltar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;const s=e.querySelector("#userForm");s.addEventListener("submit",async i=>{if(i.preventDefault(),t)return;const n={id:a.id,congregation_name:s.querySelector("#congregation_name").value,name:s.querySelector("#name").value,user:s.querySelector("#user").value,password:s.querySelector("#password").value,type:s.querySelector("#type").value,active:s.querySelector("#active").checked};u(e,"Saving user..."),await new h().update(n),g(e),alert("User saved successfully!")}),e.querySelector("#btnBack").addEventListener("click",()=>{window.history.back()})}const oe=document.getElementById("card-data"),re={id:2,congregation_name:"Cerro Rico Lenguaje de Señas",name:"Sup. Circuito",user:"super_circuito",password:"1234560",type:"CIRCUIT_OVERSEER",active:!0};R(oe,re,!1);async function ce(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="News",u(e,"Loading News...");const a=new h,l=new p().getLoggedUser(),s=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"congregation_name",label:"Congregation Name",width:"200px"},{key:"name",label:"Name",width:"150px"},{key:"user",label:"Usuario",width:"100px"},{key:"password",label:"Contraseña",width:"100px"},{key:"active",label:"Activo",width:"80px"}],data:s,rowsOptions:[15,30,60,100,150],disableDelete:!0,onView:i=>R(e,i,!0),onEdit:i=>alert("Edit User "+i),onDelete:i=>{confirm("Are you sure you want to delete user "+i+"?")&&alert("Deleted User "+i)}})}async function de(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Addresses",u(e,"Loading Addresses...");const a=new I,l=new p().getLoggedUser(),s=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"id",label:"ID",width:"50px"},{key:"congregation_number",label:"Congregation",width:"80px"},{key:"name",label:"Name",width:"200px"},{key:"address",label:"Address",width:"300px"},{key:"gender",label:"Gender",width:"80px"},{key:"age_type",label:"Age Type",width:"100px"},{key:"deaf",label:"Deaf",width:"60px"},{key:"mute",label:"Mute",width:"60px"},{key:"blind",label:"Blind",width:"60px"},{key:"sign",label:"Sign",width:"60px"},{key:"phone",label:"Phone",width:"150px"}],data:s,rowsOptions:[15,30,60,100,150],onEdit:i=>alert("Edit Address "+i),onDelete:i=>{confirm("Are you sure you want to delete address "+i+"?")&&alert("Deleted Address "+i)}})}async function me(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Addresses",u(e,"Loading Addresses...");const a=new I,l=new p().getLoggedUser(),s=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"id",label:"ID",width:"50px"},{key:"congregation_number",label:"Congregation",width:"80px"},{key:"name",label:"Name",width:"200px"},{key:"address",label:"Address",width:"300px"},{key:"gender",label:"Gender",width:"80px"},{key:"age_type",label:"Age Type",width:"100px"},{key:"deaf",label:"Deaf",width:"60px"},{key:"mute",label:"Mute",width:"60px"},{key:"blind",label:"Blind",width:"60px"},{key:"sign",label:"Sign",width:"60px"},{key:"phone",label:"Phone",width:"150px"}],data:s,rowsOptions:[15,30,60,100,150],onEdit:i=>alert("Edit Address "+i),onDelete:i=>{confirm("Are you sure you want to delete address "+i+"?")&&alert("Deleted Address "+i)}})}async function ue(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Addresses",u(e,"Loading Addresses...");const a=new I,l=new p().getLoggedUser(),s=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"id",label:"ID",width:"50px"},{key:"congregation_number",label:"Congregation",width:"80px"},{key:"name",label:"Name",width:"200px"},{key:"address",label:"Address",width:"300px"},{key:"gender",label:"Gender",width:"80px"},{key:"age_type",label:"Age Type",width:"100px"},{key:"deaf",label:"Deaf",width:"60px"},{key:"mute",label:"Mute",width:"60px"},{key:"blind",label:"Blind",width:"60px"},{key:"sign",label:"Sign",width:"60px"},{key:"phone",label:"Phone",width:"150px"}],data:s,rowsOptions:[15,30,60,100,150],onEdit:i=>alert("Edit Address "+i),onDelete:i=>{confirm("Are you sure you want to delete address "+i+"?")&&alert("Deleted Address "+i)}})}async function ge(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Addresses",u(e,"Loading Addresses...");const a=new I,l=new p().getLoggedUser(),s=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"id",label:"ID",width:"50px"},{key:"congregation_number",label:"Congregation",width:"80px"},{key:"name",label:"Name",width:"200px"},{key:"address",label:"Address",width:"300px"},{key:"gender",label:"Gender",width:"80px"},{key:"age_type",label:"Age Type",width:"100px"},{key:"deaf",label:"Deaf",width:"60px"},{key:"mute",label:"Mute",width:"60px"},{key:"blind",label:"Blind",width:"60px"},{key:"sign",label:"Sign",width:"60px"},{key:"phone",label:"Phone",width:"150px"}],data:s,rowsOptions:[15,30,60,100,150],onEdit:i=>alert("Edit Address "+i),onDelete:i=>{confirm("Are you sure you want to delete address "+i+"?")&&alert("Deleted Address "+i)}})}function j(e){var t;if(e===void 0)return;const a={home:X,user:N,userEdit:B,territory:te,territoryEdit:V,address:ie,addressEdit:H,news:ce,newsEdit:R,assignments:de,my_assignments:me,report_s13:ue,about:ge,congregation:K,congregationEdit:D};(t=a[e])==null||t.call(a)}j("home");document.addEventListener("click",e=>{var l;const a=e.target.closest("[data-page]");if(!a)return;e.preventDefault();const t=a.getAttribute("data-page");j(t),document.querySelectorAll(".nav-item").forEach(s=>s.classList.remove("active")),(l=a.closest(".nav-item"))==null||l.classList.add("active")});const ve="data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2025.0.0,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version='1.1'%20id='Layer_1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20x='0px'%20y='0px'%20viewBox='0%200%20108.3%20108.3'%20style='enable-background:new%200%200%20108.3%20108.3;'%20xml:space='preserve'%3e%3cstyle%20type='text/css'%3e%20.st0{fill:%23E6E6E6;}%20.st1{fill:%23FFB8B8;}%20.st2{fill:%23575A89;}%20.st3{fill:%232F2E41;}%20%3c/style%3e%3cg%20id='Group_45'%20transform='translate(-191%20-152.079)'%3e%3cg%20id='Group_30'%20transform='translate(282.246%20224.353)'%3e%3cpath%20id='Path_944'%20class='st0'%20d='M17.1-18.1c0,10.5-3,20.8-8.8,29.6c-1.2,1.9-2.5,3.6-4,5.3c-3.4,4-7.3,7.4-11.6,10.3%20c-1.2,0.8-2.4,1.5-3.6,2.2c-6.5,3.6-13.7,5.8-21,6.5c-1.7,0.2-3.4,0.2-5.1,0.2c-4.7,0-9.4-0.6-14-1.8c-2.6-0.7-5.1-1.6-7.6-2.6%20c-1.3-0.5-2.5-1.1-3.7-1.8c-2.9-1.5-5.6-3.3-8.2-5.3c-1.2-0.9-2.3-1.9-3.4-2.9C-95.8,1.3-97.1-33-76.8-54.9s54.6-23.3,76.5-2.9%20C10.8-47.6,17.1-33.2,17.1-18.1L17.1-18.1z'/%3e%3cpath%20id='Path_945'%20class='st1'%20d='M-50.2-13.2c0,0,4.9,13.7,1.1,21.4s6,16.4,6,16.4s25.8-13.1,22.5-19.7s-8.8-15.3-7.7-20.8%20L-50.2-13.2z'/%3e%3cellipse%20id='Ellipse_185'%20class='st1'%20cx='-40.6'%20cy='-25.5'%20rx='17.5'%20ry='17.5'/%3e%3cpath%20id='Path_946'%20class='st2'%20d='M-51.1,34.2c-2.6-0.7-5.1-1.6-7.6-2.6l0.5-13.3l4.9-11c1.1,0.9,2.3,1.6,3.5,2.3%20c0.3,0.2,0.6,0.3,0.9,0.5c4.6,2.2,12.2,4.2,19.5-1.3c2.7-2.1,5-4.7,6.7-7.6L-8.8,9l0.7,8.4l0.8,9.8c-1.2,0.8-2.4,1.5-3.6,2.2%20c-6.5,3.6-13.7,5.8-21,6.5c-1.7,0.2-3.4,0.2-5.1,0.2C-41.8,36.1-46.5,35.4-51.1,34.2z'/%3e%3cpath%20id='Path_947'%20class='st2'%20d='M-47.7-0.9L-47.7-0.9l-0.7,7.2l-0.4,3.8l-0.5,5.6l-1.8,18.5c-2.6-0.7-5.1-1.6-7.6-2.6%20c-1.3-0.5-2.5-1.1-3.7-1.8c-2.9-1.5-5.6-3.3-8.2-5.3l-1.9-9l0.1-0.1L-47.7-0.9z'/%3e%3cpath%20id='Path_948'%20class='st2'%20d='M-10.9,29.3c-6.5,3.6-13.7,5.8-21,6.5c0.4-6.7,1-13.1,1.6-18.8c0.3-2.9,0.7-5.7,1.1-8.2%20c1.2-8,2.5-13.5,3.4-14.2l6.1,4L4.9,7.3l-0.5,9.5c-3.4,4-7.3,7.4-11.6,10.3C-8.5,27.9-9.7,28.7-10.9,29.3z'/%3e%3cpath%20id='Path_949'%20class='st2'%20d='M-70.5,24.6c-1.2-0.9-2.3-1.9-3.4-2.9l0.9-6.1l0.7-0.1l3.1-0.4l6.8,14.8%20C-65.2,28.3-67.9,26.6-70.5,24.6L-70.5,24.6z'/%3e%3cpath%20id='Path_950'%20class='st2'%20d='M8.3,11.5c-1.2,1.9-2.5,3.6-4,5.3c-3.4,4-7.3,7.4-11.6,10.3c-1.2,0.8-2.4,1.5-3.6,2.2l-0.6-2.8%20l3.5-9.1l4.2-11.1l8.8,1.1C6.1,8.7,7.2,10.1,8.3,11.5z'/%3e%3cpath%20id='Path_951'%20class='st3'%20d='M-23.9-41.4c-2.7-4.3-6.8-7.5-11.6-8.9l-3.6,2.9l1.4-3.3c-1.2-0.2-2.3-0.2-3.5-0.2l-3.2,4.1%20l1.3-4c-5.6,0.7-10.7,3.7-14,8.3c-4.1,5.9-4.8,14.1-0.8,20c1.1-3.4,2.4-6.6,3.5-9.9c0.9,0.1,1.7,0.1,2.6,0l1.3-3.1l0.4,3%20c4.2-0.4,10.3-1.2,14.3-1.9l-0.4-2.3l2.3,1.9c1.2-0.3,1.9-0.5,1.9-0.7c2.9,4.7,5.8,7.7,8.8,12.5C-22.1-29.8-20.2-35.3-23.9-41.4z'%20/%3e%3cellipse%20id='Ellipse_186'%20class='st1'%20cx='-24.9'%20cy='-26.1'%20rx='1.2'%20ry='2.4'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e",F=new p,P=F.getLoggedUser();P||(window.location.href="./index.html");document.getElementById("userName").innerText=P.name;document.getElementById("nameCongregation").innerText=P.congregation_name;const pe=document.getElementById("userLogo");pe.src=ve;const be=document.getElementById("logoutLink");be.addEventListener("click",e=>{e.preventDefault(),F.logout(),window.location.href="./index.html"});
