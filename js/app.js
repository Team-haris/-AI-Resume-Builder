import { initAuth } from "./auth.js";
import { initResumeBuilder, initSavedResumePreview } from "./resume.js";
import { initDashboard } from "./dashboard.js";
import { initATS } from "./ats.js";
import { initPdfActions } from "./pdf.js";
import { storage, toast } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavigation();
  initRevealAnimations();
  initFaq();
  initTemplateActions();
  initAuth();
  initResumeBuilder();
  initSavedResumePreview();
  initDashboard();
  initATS();
  initPdfActions();
});

function initTheme() {
  const savedTheme = storage.get("theme", "light");
  document.documentElement.dataset.theme = savedTheme;
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.textContent = savedTheme === "dark" ? "Light" : "Dark";
    button.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      storage.set("theme", next);
      document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
        toggle.textContent = next === "dark" ? "Light" : "Dark";
      });
    });
  });
}

function initNavigation() {
  const menu = document.querySelector("[data-nav-menu]");
  const toggle = document.querySelector("[data-menu-toggle]");
  if (menu && toggle) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link, .sidebar-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current || (current === "index.html" && href === "#home")) link.classList.add("active");
  });
}

function initRevealAnimations() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach((item) => observer.observe(item));
}

function initFaq() {
  document.querySelectorAll("[data-faq-question]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(item.classList.contains("is-open")));
    });
  });
}

function initTemplateActions() {
  document.querySelectorAll("[data-template]").forEach((button) => {
    button.addEventListener("click", () => {
      storage.set("selectedTemplate", button.dataset.template);
      toast(`${button.dataset.template} template selected.`);
    });
  });
}
