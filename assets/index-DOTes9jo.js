(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function o(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(s){if(s.ep)return;s.ep=!0;const a=o(s);fetch(s.href,a)}})();function T(){document.getElementById("pageTitle").innerText="Home",document.getElementById("content").innerHTML=`
    <div class="container mt-5">
      <div class="text-center">
        <h1 class="display-4 mb-3">Welcome to STM - Admin Panel</h1>
        <p class="lead">Select a menu option from the sidebar to start managing data.</p>
      </div>
    </div>
  `}class u{constructor(){this.scriptGoogleUrl="https://script.google.com/macros/s/",this.idSheet="AKfycbzEOzJtIfjKSDgSZftW-kq1Szxdqkait9x8SR7zzd71s3kDTo8n_bLgSDkhKo_c9tad",this.execSheet="/exec?sheet="}getBaseUrl(i){return`${this.scriptGoogleUrl}${this.idSheet}${this.execSheet}${i}`}async get(i){const o=await fetch(this.getBaseUrl(i));if(!o.ok)throw new Error("GET error");return o.json()}async post(i,o,t){return(await fetch(`${this.getBaseUrl(i)}&method=${o}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})).json()}}class A extends u{getAll(){return this.get("congregation")}}function m(e,i="Loading..."){e.innerHTML=`
    <div class="d-flex flex-column justify-content-center align-items-center" style="height: 200px;">
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="fw-bold">${i}</div>
    </div>
  `}function y(e){e.innerHTML=""}function p({container:e,columns:i,data:o,onEdit:t,onDelete:s,rowsOptions:a=[15,30,60,100],tableHeight:l=null}){let c=1,d=a[0];function g(){const h=(c-1)*d,x=o.slice(h,h+d),v=e.getBoundingClientRect().top,k=l||window.innerHeight-v-80+"px";e.innerHTML=`
      <div class="table-responsive" style="height:${k}; overflow-x:auto; overflow-y:auto;">
        <table class="table table-striped table-hover mb-0">
          <thead class="table-secondary position-sticky top-0" style="z-index:10;">
            <tr>
              ${i.map(n=>`<th style="${n.width?`width:${n.width}; min-width:${n.width};`:""}">${n.label}</th>`).join("")}
              <th class="text-end" style="width:120px; min-width:120px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${x.map(n=>`
              <tr>
                ${i.map(r=>`<td>${n[r.key]}</td>`).join("")}
                <td class="text-end text-nowrap" style="min-width:120px;">
                  ${t?`<button class="btn btn-sm btn-primary me-1" data-id="${n.id}" data-action="edit"><i class="bi bi-pencil"></i></button>`:""}
                  ${s?`<button class="btn btn-sm btn-danger" data-id="${n.id}" data-action="delete"><i class="bi bi-trash"></i></button>`:""}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-2">
        <div>
          Show
          <select id="rowsPerPage" class="form-select d-inline-block w-auto">
            ${a.map(n=>`<option value="${n}" ${n===d?"selected":""}>${n}</option>`).join("")}
          </select>
          entries
        </div>
        <div id="pagination" class="btn-group"></div>
      </div>
    `,e.querySelector("#rowsPerPage").addEventListener("change",n=>{d=parseInt(n.target.value),c=1,g()});const b=e.querySelector("#pagination"),E=Math.ceil(o.length/d);b.innerHTML="";for(let n=1;n<=E;n++){const r=document.createElement("button");r.className=`btn btn-sm ${n===c?"btn-primary":"btn-outline-primary"}`,r.textContent=n,r.addEventListener("click",()=>{c=n,g()}),b.appendChild(r)}e.querySelectorAll("button[data-action]").forEach(n=>{n.addEventListener("click",()=>{const r=n.dataset.id;n.dataset.action==="edit"&&t&&t(r),n.dataset.action==="delete"&&s&&s(r)})})}window.addEventListener("resize",()=>g()),g()}async function L(){const e=document.getElementById("content");document.getElementById("pageTitle").innerText="Congregations",m(e,"Loading Congregations...");const o=await new A().getAll();y(e),p({container:e,columns:[{key:"id",label:"ID",width:"50px"},{key:"number",label:"Number",width:"80px"},{key:"name",label:"Name",width:"200px"},{key:"city",label:"City",width:"150px"},{key:"active",label:"Active",width:"80px"}],data:o,rowsOptions:[15,30,60,100,150],tableHeight:null,onEdit:t=>alert("Edit Congregation "+t),onDelete:t=>{confirm("Are you sure you want to delete congregation "+t+"?")&&alert("Deleted Congregation "+t)}})}class S extends u{getAll(){return this.get("user")}}async function $(){const e=document.getElementById("content");document.getElementById("pageTitle").innerText="Users",m(e,"Loading Users...");const o=await new S().getAll();y(e),p({container:e,columns:[{key:"id",label:"ID",width:"50px"},{key:"congregation_number",label:"Cong. Number",width:"100px"},{key:"congregation_name",label:"Congregation Name",width:"200px"},{key:"name",label:"Name",width:"150px"},{key:"user",label:"Username",width:"100px"},{key:"type",label:"Type",width:"100px"},{key:"active",label:"Active",width:"80px"}],data:o,rowsOptions:[15,30,60,100,150],tableHeight:null,onEdit:t=>alert("Edit User "+t),onDelete:t=>{confirm("Are you sure you want to delete user "+t+"?")&&alert("Deleted User "+t)}})}class B extends u{getAll(){return this.get("territory")}}async function I(){const e=document.getElementById("content");document.getElementById("pageTitle").innerText="Territories",m(e,"Loading Territories...");const o=await new B().getAll();y(e),p({container:e,columns:[{key:"id",label:"ID",width:"20px"},{key:"number",label:"Number",width:"20px"},{key:"name",label:"Name"}],data:o,rowsOptions:[15,30,60,100,150],tableHeight:null,onEdit:t=>alert("Edit Territory "+t),onDelete:t=>{confirm("Are you sure you want to delete territory "+t+"?")&&alert("Deleted Territory "+t)}})}class C extends u{getAll(){return this.get("address")}}async function D(){const e=document.getElementById("content");document.getElementById("pageTitle").innerText="Addresses",m(e,"Loading Addresses...");const o=await new C().getAll();y(e),p({container:e,columns:[{key:"id",label:"ID",width:"50px"},{key:"congregation_number",label:"Congregation",width:"80px"},{key:"name",label:"Name",width:"200px"},{key:"address",label:"Address",width:"300px"},{key:"gender",label:"Gender",width:"80px"},{key:"age_type",label:"Age Type",width:"100px"},{key:"deaf",label:"Deaf",width:"60px"},{key:"mute",label:"Mute",width:"60px"},{key:"blind",label:"Blind",width:"60px"},{key:"sign",label:"Sign",width:"60px"},{key:"phone",label:"Phone",width:"150px"}],data:o,rowsOptions:[15,30,60,100,150],tableHeight:null,onEdit:t=>alert("Edit Address "+t),onDelete:t=>{confirm("Are you sure you want to delete address "+t+"?")&&alert("Deleted Address "+t)}})}function f(e){var o;if(e===void 0)return;const i={home:T,congregation:L,user:$,territory:I,address:D};(o=i[e])==null||o.call(i)}const w=document.getElementById("sidebar"),P=document.getElementById("toggleSidebar");P.addEventListener("click",()=>{w.classList.toggle("collapsed")});document.querySelectorAll("#sidebar .nav-link").forEach(e=>{e.addEventListener("click",()=>{const i=e.dataset.page;f(i),window.innerWidth<992&&w.classList.add("collapsed")})});f("home");
