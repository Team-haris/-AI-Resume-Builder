import { storage, toast } from "./storage.js";

const steps = ["personal", "education", "experience", "skills", "projects", "certificates", "languages", "interests"];

export function initResumeBuilder() {
  const form = document.querySelector("[data-resume-form]");
  if (!form) return;

  const saved = storage.get("resumeDraft", {});
  Object.entries(saved).forEach(([key, value]) => {
    if (form.elements[key]) form.elements[key].value = value;
  });

  let currentStep = 0;
  const panels = [...document.querySelectorAll("[data-step]")];
  const progress = document.querySelector("[data-progress]");
  const stepLabel = document.querySelector("[data-step-label]");

  const updateStep = () => {
    panels.forEach((panel, index) => panel.classList.toggle("active", index === currentStep));
    progress.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    stepLabel.textContent = `${currentStep + 1} of ${steps.length}`;
    document.querySelector("[data-prev]").disabled = currentStep === 0;
    document.querySelector("[data-next]").textContent = currentStep === steps.length - 1 ? "Finish" : "Next";
  };

  form.addEventListener("input", () => {
    saveDraft(form);
    updatePreview(form);
  });

  document.querySelector("[data-prev]").addEventListener("click", () => {
    currentStep = Math.max(0, currentStep - 1);
    updateStep();
  });

  document.querySelector("[data-next]").addEventListener("click", () => {
    if (currentStep === steps.length - 1) {
      saveDraft(form);
      toast("Resume draft saved.");
      return;
    }
    currentStep = Math.min(steps.length - 1, currentStep + 1);
    updateStep();
  });

  window.setInterval(() => saveDraft(form, false), 10000);
  updatePreview(form);
  updateStep();
}

export function initSavedResumePreview() {
  const preview = document.querySelector("[data-saved-preview]");
  if (!preview) return;
  const data = storage.get("resumeDraft", {});
  preview.innerHTML = renderResume(data);
}

function saveDraft(form, notify = false) {
  storage.set("resumeDraft", Object.fromEntries(new FormData(form)));
  if (notify) toast("Draft saved.");
}

export function updatePreview(form) {
  const data = Object.fromEntries(new FormData(form));
  const preview = document.querySelector("[data-live-preview]");
  if (!preview) return;
  preview.innerHTML = renderResume(data);
}

function renderResume(data) {
  const text = (value, fallback) => value?.trim() || fallback;
  const skills = text(data.skills, "HTML, CSS, JavaScript").split(",").map((item) => item.trim()).filter(Boolean);
  return `
    <h2>${escapeHtml(text(data.fullName, "Your Name"))}</h2>
    <div class="contact-line">${escapeHtml(text(data.email, "email@example.com"))} | ${escapeHtml(text(data.phone, "+91 00000 00000"))} | ${escapeHtml(text(data.location, "Your City"))}</div>
    <section class="resume-section"><h3>Summary</h3><p>${escapeHtml(text(data.summary, "AI-ready professional summary will appear here as you write."))}</p></section>
    <section class="resume-section"><h3>Education</h3><p><strong>${escapeHtml(text(data.degree, "Degree"))}</strong><br>${escapeHtml(text(data.college, "College / University"))} - ${escapeHtml(text(data.year, "Year"))}</p></section>
    <section class="resume-section"><h3>Experience</h3><p><strong>${escapeHtml(text(data.role, "Role"))}</strong> at ${escapeHtml(text(data.company, "Company"))}<br>${escapeHtml(text(data.experience, "Your impact and responsibilities."))}</p></section>
    <section class="resume-section"><h3>Projects</h3><p><strong>${escapeHtml(text(data.projectName, "Project Name"))}</strong><br>${escapeHtml(text(data.projectDescription, "Project description and technologies."))}</p></section>
    <section class="resume-section"><h3>Skills</h3><div class="pill-list">${skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}</div></section>
    <section class="resume-section"><h3>Certificates</h3><p>${escapeHtml(text(data.certificates, "Certificates and achievements."))}</p></section>
    <section class="resume-section"><h3>Languages & Interests</h3><p>${escapeHtml(text(data.languages, "English"))} | ${escapeHtml(text(data.interests, "Reading, coding, problem solving"))}</p></section>
  `;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}
