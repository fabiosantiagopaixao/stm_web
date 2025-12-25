export function loadHome() {
  document.getElementById("pageTitle").innerText = "Home";
  document.getElementById("content").innerHTML = `
    <div class="container">
      <h1 class="mt-5">Welcome to Admin Panel</h1>
      <p>Select a menu option to start.</p>
    </div>
  `;
}
