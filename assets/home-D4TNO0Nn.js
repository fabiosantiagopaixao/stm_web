import{s as v,C as W,L as b,h as g,U as h,T as X,A as I}from"./loading-Dc4beW_t.js";function K(){document.getElementById("pageTitle").innerText="Home",document.getElementById("card-data").innerHTML=`
    <div class="container mt-5">
      <div class="text-center">
        <h1 class="display-4 mb-3">Welcome to STM - Admin Panel</h1>
        <p class="lead">Select a menu option from the sidebar to start managing data.</p>
      </div>
    </div>
  `}function y({container:e,columns:a,data:t,onView:l,onEdit:i,onDelete:s,disableEdit:n=!1,disableDelete:r=!1,rowsOptions:c=[15,30,60,100]}){let o=1,u=c[0];function p(m){return m===!0?`
        <span class="text-success" title="Activo">
          <i class="fas fa-check-circle"></i>
        </span>
      `:m===!1?`
        <span class="text-danger" title="Inactivo">
          <i class="fas fa-times-circle"></i>
        </span>
      `:m??""}function A(m){return typeof m=="boolean"}function T(m){return(m==null?void 0:m.toLowerCase())==="activo"?"text-center":""}function f(){const m=t.length,S=Math.ceil(m/u),L=(o-1)*u,x=Math.min(L+u,m),w=t.slice(L,x);e.innerHTML=`
      <div class="card shadow mb-4">
        <div class="card-body">

          <!-- Rows per page -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              Show
              <select id="rowsPerPage" class="form-select form-select-sm d-inline w-auto">
                ${c.map(d=>`
                  <option value="${d}" ${d===u?"selected":""}>
                    ${d}
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
                  ${a.map(d=>`
                    <th class="${T(d.label)}">
                      ${d.label}
                    </th>
                  `).join("")}
                  <th class="text-end" style="width:140px">Actions</th>
                </tr>
              </thead>

              <tbody>
                ${w.map(d=>`
                  <tr>
                    ${a.map(C=>`
                      <td class="${A(d[C.key])?"text-center":""}">
                        ${p(d[C.key])}
                      </td>
                    `).join("")}

                    <td class="text-end text-nowrap">

                      <!-- View -->
                      ${l?`
                        <a href="#"
                           class="btn btn-info btn-circle btn-sm"
                           data-id="${d.id}"
                           data-action="view">
                          <i class="fas fa-eye"></i>
                        </a>
                      `:""}

                      <!-- Edit -->
                      ${i&&!n?`
                        <a href="#"
                           class="btn btn-warning btn-circle btn-sm"
                           data-id="${d.id}"
                           data-action="edit">
                          <i class="fas fa-edit"></i>
                        </a>
                      `:""}

                      <!-- Delete -->
                      ${s&&!r?`
                        <a href="#"
                           class="btn btn-danger btn-circle btn-sm"
                           data-id="${d.id}"
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
                Showing ${L+1} to ${x} of ${m} entries
              </div>
            </div>

            <div class="col-md-7">
              <ul class="pagination justify-content-end mb-0" id="pagination"></ul>
            </div>
          </div>

        </div>
      </div>
    `,e.querySelector("#rowsPerPage").addEventListener("change",d=>{u=Number(d.target.value),o=1,f()});const k=e.querySelector("#pagination");k.innerHTML="",k.appendChild(E("Previous",o===1,()=>{o--,f()}));for(let d=1;d<=S;d++)k.appendChild(E(d,d===o,()=>{o=d,f()}));k.appendChild(E("Next",o===S,()=>{o++,f()})),e.querySelectorAll("a[data-action]").forEach(d=>{d.addEventListener("click",C=>{if(C.preventDefault(),d.classList.contains("disabled"))return;const _=d.dataset.action,G=d.dataset.id,N=t.find(Y=>Y.id==G);_==="view"&&l&&l(N),_==="edit"&&i&&i(N),_==="delete"&&s&&s(N)})})}function E(m,S,L){const x=document.createElement("li");x.className=`page-item ${S?"disabled":""} ${m===o?"active":""}`;const w=document.createElement("a");return w.href="#",w.className="page-link",w.textContent=m,w.addEventListener("click",k=>{k.preventDefault(),S||L()}),x.appendChild(w),x}f()}async function z(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Congregations",v(e,"Loading Congregations...");const a=new W,l=new b().getLoggedUser(),i=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"id",label:"ID",width:"50px"},{key:"number",label:"Number",width:"80px"},{key:"name",label:"Name",width:"200px"},{key:"city",label:"City",width:"150px"},{key:"active",label:"Active",width:"80px"}],data:i,rowsOptions:[15,30,60,100,150],onEdit:s=>alert("Edit Congregation "+s),onDelete:s=>{confirm("Are you sure you want to delete congregation "+s+"?")&&alert("Deleted Congregation "+s)}})}function P(e,a,t=!1){document.getElementById("card-data");let l=t?"View User":"Edit User";l=l+" - "+a.name,document.getElementById("pageTitle").innerText=l,e.innerHTML=`
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
  `;const i=e.querySelector("#userForm");i.addEventListener("submit",async s=>{if(s.preventDefault(),t)return;const n={id:a.id,congregation_name:i.querySelector("#congregation_name").value,name:i.querySelector("#name").value,user:i.querySelector("#user").value,password:i.querySelector("#password").value,type:i.querySelector("#type").value,active:i.querySelector("#active").checked};v(e,"Saving user..."),await new h().update(n),g(e),alert("User saved successfully!")}),e.querySelector("#btnBack").addEventListener("click",()=>{window.history.back()})}const J=document.getElementById("card-data"),Q={id:2,congregation_name:"Cerro Rico Lenguaje de Señas",name:"Sup. Circuito",user:"super_circuito",password:"1234560",type:"CIRCUIT_OVERSEER",active:!0};P(J,Q,!1);function O(e,a={}){const{id:t="alertModal",type:l="INFO",title:i="Attention",message:s="",buttons:n=[{text:"OK",className:"btn btn-primary",dismiss:!0}]}=a,r=document.getElementById(t);r&&r.remove();let c="";switch(l.toUpperCase()){case"ERROR":c='<i class="fas fa-times-circle text-danger fa-2x mr-2"></i>';break;case"WARNING":c='<i class="fas fa-exclamation-triangle text-warning fa-2x mr-2"></i>';break;case"INFO":default:c='<i class="fas fa-info-circle text-primary fa-2x mr-2"></i>';break}const o=document.createElement("div");return o.className="modal fade",o.id=t,o.tabIndex=-1,o.setAttribute("role","dialog"),o.innerHTML=`
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${c}${i}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">${s}</div>
        <div class="modal-footer">
          ${n.map((u,p)=>`
            <button type="button" class="${u.className}" id="${t}-btn-${p}" ${u.dismiss?'data-dismiss="modal"':""}>
              ${u.text}
            </button>
          `).join("")}
        </div>
      </div>
    </div>
  `,e.appendChild(o),n.forEach((u,p)=>{u.action&&document.getElementById(`${t}-btn-${p}`).addEventListener("click",u.action)}),$(`#${t}`)}const Z=["PUBLISHER","ADMINISTRATOR","CIRCUIT_OVERSEER","AUXILIARY"];function M(e){return{PUBLISHER:"Publicador",ADMINISTRATOR:"Administrador",CIRCUIT_OVERSEER:"Superintendente de circuito",AUXILIARY:"Auxiliar"}[e]||e}function B(e){e.classList.add("is-invalid")}function ee(e){e.classList.remove("is-invalid")}function U(e,a=null,t=!1){let l=a=null;const i=a||{name:"",user:"",password:"",type:"PUBLISHER",active:!0};document.getElementById("pageTitle").innerText=`${t?"View User":l?"Create User":"Edit User"} - ${i.name}`,e.innerHTML=`
    <div class="card shadow mb-4">
      <div class="card-body">
        <form id="userForm" novalidate>

          <!-- Name / User -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-control" id="name" placeholder="Insira su Nombre"
                     value="${i.name}" ${t?"disabled":""}>
              <div class="invalid-feedback">El nombre es obligatorio</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Usuario</label>
              <input type="text" class="form-control" id="user" placeholder="Insira su Usuario"
                     value="${i.user}" ${t?"disabled":""}>
              <div class="invalid-feedback">El usuario es obligatorio</div>
            </div>
          </div>

          <!-- Password -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="password" placeholder="Insira su Contraseña"
                     value="${i.password}" ${t?"disabled":""}>
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
                           ${i.type===n?"checked":""}
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
                       ${i.active?"checked":""}
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
  `;const s=e.querySelector("#userForm");s.addEventListener("submit",async n=>{if(n.preventDefault(),t)return;let r=!1;const c=s.querySelector("#name"),o=s.querySelector("#user"),u=s.querySelector("#password"),p=s.querySelector("#active"),A=s.querySelector('input[name="type"]:checked'),T=s.querySelector("#typeError");if([c,o,u,p].forEach(ee),T.style.display="none",c.value.trim()||(B(c),r=!0),o.value.trim()||(B(o),r=!0),u.value.trim()||(B(u),r=!0),A||(T.style.display="block",r=!0),p.checked||(B(p),r=!0),r)return;const f=new b,E={id:i.id??null,name:c.value.trim(),user:o.value.trim(),password:u.value.trim(),type:A.value,active:p.checked,congregation_number:f.getLoggedUser().congregation_number};v(null,"Saving user...");try{await new h().saveUpdate(E),O(document.body,{type:"INFO",title:"Info",message:"Usuário salvo com sucesso!"}).modal("show"),q()}catch(m){console.error("Error saving user:",m),O(document.body,{type:"ERROR",title:"Error",message:"Ocorreu um erro ao salvar usuário!"}).modal("show")}finally{g()}}),e.querySelector("#btnBack").addEventListener("click",()=>{q()})}async function q(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Users";const a=document.getElementById("actionsButtons");if(a){a.innerHTML="";const n=document.createElement("button");n.className="btn btn-primary mb-3",n.innerHTML='<i class="fas fa-plus"></i> Adicionar',a.appendChild(n),n.addEventListener("click",()=>{U(e,null,!1)})}v(e,"Loading Users...");const t=new h,i=new b().getLoggedUser(),s=await t.getByCongregation(i.congregation_number);g(e),y({container:e,columns:[{key:"name",label:"Name",width:"150px"},{key:"user",label:"Usuario",width:"100px"},{key:"password",label:"Contraseña",width:"100px"},{key:"active",label:"Activo",width:"80px"}],data:s,rowsOptions:[15,30,60,100,150],disableDelete:!0,onView:n=>U(e,n,!0),onEdit:n=>U(e,n,!1),onDelete:n=>{confirm("Are you sure you want to delete user "+n+"?")&&alert("Deleted User "+n)}})}async function te(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Territories",v(e,"Loading Territories...");const a=new X,l=new b().getLoggedUser(),i=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"id",label:"ID",width:"20px"},{key:"number",label:"Number",width:"20px"},{key:"name",label:"Name"}],data:i,rowsOptions:[15,30,60,100,150],onEdit:s=>alert("Edit Territory "+s),onDelete:s=>{confirm("Are you sure you want to delete territory "+s+"?")&&alert("Deleted Territory "+s)}})}function D(e,a,t=!1){document.getElementById("card-data");let l=t?"View User":"Edit User";l=l+" - "+a.name,document.getElementById("pageTitle").innerText=l,e.innerHTML=`
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
  `;const i=e.querySelector("#userForm");i.addEventListener("submit",async s=>{if(s.preventDefault(),t)return;const n={id:a.id,congregation_name:i.querySelector("#congregation_name").value,name:i.querySelector("#name").value,user:i.querySelector("#user").value,password:i.querySelector("#password").value,type:i.querySelector("#type").value,active:i.querySelector("#active").checked};v(e,"Saving user..."),await new h().update(n),g(e),alert("User saved successfully!")}),e.querySelector("#btnBack").addEventListener("click",()=>{window.history.back()})}const ae=document.getElementById("card-data"),se={id:2,congregation_name:"Cerro Rico Lenguaje de Señas",name:"Sup. Circuito",user:"super_circuito",password:"1234560",type:"CIRCUIT_OVERSEER",active:!0};D(ae,se,!1);async function ie(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Addresses",v(e,"Loading Addresses...");const a=new I,l=new b().getLoggedUser(),i=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"id",label:"ID",width:"50px"},{key:"congregation_number",label:"Congregation",width:"80px"},{key:"name",label:"Name",width:"200px"},{key:"address",label:"Address",width:"300px"},{key:"gender",label:"Gender",width:"80px"},{key:"age_type",label:"Age Type",width:"100px"},{key:"deaf",label:"Deaf",width:"60px"},{key:"mute",label:"Mute",width:"60px"},{key:"blind",label:"Blind",width:"60px"},{key:"sign",label:"Sign",width:"60px"},{key:"phone",label:"Phone",width:"150px"}],data:i,rowsOptions:[15,30,60,100,150],onEdit:s=>alert("Edit Address "+s),onDelete:s=>{confirm("Are you sure you want to delete address "+s+"?")&&alert("Deleted Address "+s)}})}function j(e,a,t=!1){document.getElementById("card-data");let l=t?"View User":"Edit User";l=l+" - "+a.name,document.getElementById("pageTitle").innerText=l,e.innerHTML=`
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
  `;const i=e.querySelector("#userForm");i.addEventListener("submit",async s=>{if(s.preventDefault(),t)return;const n={id:a.id,congregation_name:i.querySelector("#congregation_name").value,name:i.querySelector("#name").value,user:i.querySelector("#user").value,password:i.querySelector("#password").value,type:i.querySelector("#type").value,active:i.querySelector("#active").checked};v(e,"Saving user..."),await new h().update(n),g(e),alert("User saved successfully!")}),e.querySelector("#btnBack").addEventListener("click",()=>{window.history.back()})}const le=document.getElementById("card-data"),ne={id:2,congregation_name:"Cerro Rico Lenguaje de Señas",name:"Sup. Circuito",user:"super_circuito",password:"1234560",type:"CIRCUIT_OVERSEER",active:!0};j(le,ne,!1);function R(e,a,t=!1){document.getElementById("card-data");let l=t?"View User":"Edit User";l=l+" - "+a.name,document.getElementById("pageTitle").innerText=l,e.innerHTML=`
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
  `;const i=e.querySelector("#userForm");i.addEventListener("submit",async s=>{if(s.preventDefault(),t)return;const n={id:a.id,congregation_name:i.querySelector("#congregation_name").value,name:i.querySelector("#name").value,user:i.querySelector("#user").value,password:i.querySelector("#password").value,type:i.querySelector("#type").value,active:i.querySelector("#active").checked};v(e,"Saving user..."),await new h().update(n),g(e),alert("User saved successfully!")}),e.querySelector("#btnBack").addEventListener("click",()=>{window.history.back()})}const oe=document.getElementById("card-data"),de={id:2,congregation_name:"Cerro Rico Lenguaje de Señas",name:"Sup. Circuito",user:"super_circuito",password:"1234560",type:"CIRCUIT_OVERSEER",active:!0};R(oe,de,!1);async function re(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="News",v(e,"Loading News...");const a=new h,l=new b().getLoggedUser(),i=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"congregation_name",label:"Congregation Name",width:"200px"},{key:"name",label:"Name",width:"150px"},{key:"user",label:"Usuario",width:"100px"},{key:"password",label:"Contraseña",width:"100px"},{key:"active",label:"Activo",width:"80px"}],data:i,rowsOptions:[15,30,60,100,150],disableDelete:!0,onView:s=>R(e,s,!0),onEdit:s=>alert("Edit User "+s),onDelete:s=>{confirm("Are you sure you want to delete user "+s+"?")&&alert("Deleted User "+s)}})}async function ce(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Addresses",v(e,"Loading Addresses...");const a=new I,l=new b().getLoggedUser(),i=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"id",label:"ID",width:"50px"},{key:"congregation_number",label:"Congregation",width:"80px"},{key:"name",label:"Name",width:"200px"},{key:"address",label:"Address",width:"300px"},{key:"gender",label:"Gender",width:"80px"},{key:"age_type",label:"Age Type",width:"100px"},{key:"deaf",label:"Deaf",width:"60px"},{key:"mute",label:"Mute",width:"60px"},{key:"blind",label:"Blind",width:"60px"},{key:"sign",label:"Sign",width:"60px"},{key:"phone",label:"Phone",width:"150px"}],data:i,rowsOptions:[15,30,60,100,150],onEdit:s=>alert("Edit Address "+s),onDelete:s=>{confirm("Are you sure you want to delete address "+s+"?")&&alert("Deleted Address "+s)}})}async function me(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Addresses",v(e,"Loading Addresses...");const a=new I,l=new b().getLoggedUser(),i=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"id",label:"ID",width:"50px"},{key:"congregation_number",label:"Congregation",width:"80px"},{key:"name",label:"Name",width:"200px"},{key:"address",label:"Address",width:"300px"},{key:"gender",label:"Gender",width:"80px"},{key:"age_type",label:"Age Type",width:"100px"},{key:"deaf",label:"Deaf",width:"60px"},{key:"mute",label:"Mute",width:"60px"},{key:"blind",label:"Blind",width:"60px"},{key:"sign",label:"Sign",width:"60px"},{key:"phone",label:"Phone",width:"150px"}],data:i,rowsOptions:[15,30,60,100,150],onEdit:s=>alert("Edit Address "+s),onDelete:s=>{confirm("Are you sure you want to delete address "+s+"?")&&alert("Deleted Address "+s)}})}async function ue(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Addresses",v(e,"Loading Addresses...");const a=new I,l=new b().getLoggedUser(),i=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"id",label:"ID",width:"50px"},{key:"congregation_number",label:"Congregation",width:"80px"},{key:"name",label:"Name",width:"200px"},{key:"address",label:"Address",width:"300px"},{key:"gender",label:"Gender",width:"80px"},{key:"age_type",label:"Age Type",width:"100px"},{key:"deaf",label:"Deaf",width:"60px"},{key:"mute",label:"Mute",width:"60px"},{key:"blind",label:"Blind",width:"60px"},{key:"sign",label:"Sign",width:"60px"},{key:"phone",label:"Phone",width:"150px"}],data:i,rowsOptions:[15,30,60,100,150],onEdit:s=>alert("Edit Address "+s),onDelete:s=>{confirm("Are you sure you want to delete address "+s+"?")&&alert("Deleted Address "+s)}})}async function ve(){const e=document.getElementById("card-data");document.getElementById("pageTitle").innerText="Addresses",v(e,"Loading Addresses...");const a=new I,l=new b().getLoggedUser(),i=await a.getByCongregation(l.congregation_number);g(e),y({container:e,columns:[{key:"id",label:"ID",width:"50px"},{key:"congregation_number",label:"Congregation",width:"80px"},{key:"name",label:"Name",width:"200px"},{key:"address",label:"Address",width:"300px"},{key:"gender",label:"Gender",width:"80px"},{key:"age_type",label:"Age Type",width:"100px"},{key:"deaf",label:"Deaf",width:"60px"},{key:"mute",label:"Mute",width:"60px"},{key:"blind",label:"Blind",width:"60px"},{key:"sign",label:"Sign",width:"60px"},{key:"phone",label:"Phone",width:"150px"}],data:i,rowsOptions:[15,30,60,100,150],onEdit:s=>alert("Edit Address "+s),onDelete:s=>{confirm("Are you sure you want to delete address "+s+"?")&&alert("Deleted Address "+s)}})}function V(e){var t;if(e===void 0)return;const a={home:K,user:q,userEdit:U,territory:te,territoryEdit:D,address:ie,addressEdit:j,news:re,newsEdit:R,assignments:ce,my_assignments:me,report_s13:ue,about:ve,congregation:z,congregationEdit:P};(t=a[e])==null||t.call(a)}V("home");document.addEventListener("click",e=>{var l;const a=e.target.closest("[data-page]");if(!a)return;e.preventDefault();const t=a.getAttribute("data-page");V(t),document.querySelectorAll(".nav-item").forEach(i=>i.classList.remove("active")),(l=a.closest(".nav-item"))==null||l.classList.add("active")});const F=new b,H=F.getLoggedUser();H||(window.location.href="../../index.html");document.getElementById("userName").innerHTML=`${H.name}`;document.getElementById("nameCongregation").innerHTML=`${H.congregation_name}`;function ge(e,a={}){const{id:t="logoutModal",title:l="Ready to Leave?",message:i='Select "Logout" below if you are ready to end your current session.',buttons:s=[{text:"Cancel",className:"btn btn-secondary",dismiss:!0},{text:"Logout",className:"btn btn-primary",action:a.onLogout||(()=>{})}]}=a,n=document.getElementById(t);n&&n.remove();const r=document.createElement("div");return r.className="modal fade",r.id=t,r.tabIndex=-1,r.setAttribute("role","dialog"),r.innerHTML=`
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${l}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">${i}</div>
                <div class="modal-footer">
                    ${s.map((c,o)=>`
                        <button type="button" class="${c.className}" id="${t}-btn-${o}"
                            ${c.dismiss?'data-dismiss="modal"':""}>
                            ${c.text}
                        </button>
                    `).join("")}
                </div>
            </div>
        </div>
        `,e.appendChild(r),s.forEach((c,o)=>{c.action&&document.getElementById(`${t}-btn-${o}`).addEventListener("click",c.action)}),$(`#${t}`)}const be=ge(document.body,{onLogout:()=>{F.logout(),window.location.href="index.html"}});document.querySelector('a[data-target="#logoutModal"]').addEventListener("click",e=>{e.preventDefault(),be.modal("show")});
