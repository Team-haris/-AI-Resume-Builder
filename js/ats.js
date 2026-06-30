export function initATS() {
  const ring = document.querySelector("[data-ats-ring]");
  if (!ring) return;
  const score = Number(ring.dataset.score || 86);
  ring.style.setProperty("--score", `${score}%`);
}
