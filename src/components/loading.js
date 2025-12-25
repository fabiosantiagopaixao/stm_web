// src/components/loading.js

export function showLoading(container, message = "Loading...") {
  container.innerHTML = `
    <div class="d-flex flex-column justify-content-center align-items-center" style="height: 200px;">
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="fw-bold">${message}</div>
    </div>
  `;
}

export function hideLoading(container) {
  container.innerHTML = ""; // limpa o container ou você pode colocar outro conteúdo
}
