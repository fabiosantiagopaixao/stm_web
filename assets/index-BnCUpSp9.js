(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))e(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&e(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function e(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();function c(){document.getElementById("pageTitle").innerText="Home",document.getElementById("content").innerHTML=`
    <div class="container">
      <h1 class="mt-5">Welcome to STM - Admin Panel</h1>
      <p>Select a menu option to start.</p>
    </div>
  `}class l{constructor(){this.scriptGoogleUrl="https://script.google.com/macros/s/",this.idSheet="AKfycbzEOzJtIfjKSDgSZftW-kq1Szxdqkait9x8SR7zzd71s3kDTo8n_bLgSDkhKo_c9tad",this.execSheet="/exec?sheet="}getBaseUrl(r){return`${this.scriptGoogleUrl}${this.idSheet}${this.execSheet}${r}`}async get(r){const n=await fetch(this.getBaseUrl(r));if(!n.ok)throw new Error("GET error");return n.json()}async post(r,n,e){return(await fetch(`${this.getBaseUrl(r)}&method=${n}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).json()}}class d extends l{getAll(){return this.get("territory")}}async function b(){document.getElementById("pageTitle").innerText="Congregaciones";const t=document.getElementById("content"),n=await new d().getAll();t.innerHTML=`
    <div class="card shadow-sm">
      <div class="card-body p-0">
        <table class="table table-striped table-hover mb-0">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Number</th>
              <th>Name</th>
              <th style="width: 150px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${n.map(e=>`
              <tr>
                <td>${e.id}</td>
                <td>${e.number}</td>
                <td>${e.name}</td>
                <td>
                  <button class="btn btn-sm btn-primary me-1" onclick="editTerritory(${e.id})">Edit</button>
                  <button class="btn btn-sm btn-danger" onclick="deleteTerritory(${e.id})">Delete</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}window.editTerritory=t=>alert("Edit "+t);window.deleteTerritory=t=>alert("Delete "+t);async function m(){document.getElementById("pageTitle").innerText="Usuarios";const t=document.getElementById("content"),n=await new d().getAll();t.innerHTML=`
    <div class="card shadow-sm">
      <div class="card-body p-0">
        <table class="table table-striped table-hover mb-0">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Number</th>
              <th>Name</th>
              <th style="width: 150px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${n.map(e=>`
              <tr>
                <td>${e.id}</td>
                <td>${e.number}</td>
                <td>${e.name}</td>
                <td>
                  <button class="btn btn-sm btn-primary me-1" onclick="editTerritory(${e.id})">Edit</button>
                  <button class="btn btn-sm btn-danger" onclick="deleteTerritory(${e.id})">Delete</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}window.editTerritory=t=>alert("Edit "+t);window.deleteTerritory=t=>alert("Delete "+t);async function h(){document.getElementById("pageTitle").innerText="Territories";const t=document.getElementById("content"),n=await new d().getAll();t.innerHTML=`
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Number</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${n.map(e=>`
          <tr>
            <td>${e.id}</td>
            <td>${e.number}</td>
            <td>${e.name}</td>
            <td>
              <button class="btn btn-sm btn-primary" onclick="editTerritory(${e.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteTerritory(${e.id})">Delete</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `}window.editTerritory=t=>alert("Edit "+t);window.deleteTerritory=t=>alert("Delete "+t);async function u(){document.getElementById("pageTitle").innerText="Dirrecciones";const t=document.getElementById("content"),n=await new d().getAll();t.innerHTML=`
    <div class="card shadow-sm">
      <div class="card-body p-0">
        <table class="table table-striped table-hover mb-0">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Number</th>
              <th>Name</th>
              <th style="width: 150px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${n.map(e=>`
              <tr>
                <td>${e.id}</td>
                <td>${e.number}</td>
                <td>${e.name}</td>
                <td>
                  <button class="btn btn-sm btn-primary me-1" onclick="editTerritory(${e.id})">Edit</button>
                  <button class="btn btn-sm btn-danger" onclick="deleteTerritory(${e.id})">Delete</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}window.editTerritory=t=>alert("Edit "+t);window.deleteTerritory=t=>alert("Delete "+t);function a(t){var n;const r={home:c,congregation:b,user:m,territory:h,address:u};(n=r[t])==null||n.call(r)}window.navigate=a;a("home");
