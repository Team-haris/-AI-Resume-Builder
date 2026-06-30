export function initDashboard() {
  const chart = document.querySelector("[data-analytics]");
  if (!chart) return;
  const values = [82, 91, 76, 88];
  chart.innerHTML = values.map((value, index) => `
    <div class="progress-item">
      <strong>Resume ${index + 1}</strong>
      <div class="analytics-bar"><span style="width:${value}%"></span></div>
      <small class="muted">ATS score ${value}%</small>
    </div>
  `).join("");
}
