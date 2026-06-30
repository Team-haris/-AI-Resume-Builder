export function generateMockSummary(skills = "HTML, CSS, JavaScript") {
  return `Motivated candidate with hands-on knowledge of ${skills}, focused on building reliable, user-friendly digital products.`;
}

export function improveBullet(text) {
  return text ? `Improved: ${text.trim()} with measurable impact, collaboration, and delivery focus.` : "";
}
