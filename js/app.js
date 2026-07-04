import { initAuth, checkAuth, logout } from "./auth.js";
import { initResumeBuilder, initSavedResumePreview } from "./resume.js";
import { initDashboard } from "./dashboard.js";
import { initATS } from "./ats.js";
import { initPdfActions } from "./pdf.js";
import { storage } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Enforce authentication rules first
  checkAuth();

  // 2. Setup theme, navigation, FAQ, and dynamics
  initTheme();
  initNavigation();
  updateNavbarAuthUI();
  initRevealAnimations();
  initFaq();
  initTemplateActions();

  // 3. Initialize feature blocks
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

function updateNavbarAuthUI() {
  const token = sessionStorage.getItem("airb:token");
  const navActions = document.querySelector(".nav-actions");
  if (!navActions) return;

  // Find Login & Get Started/Signup buttons (if any)
  const authLinks = [...navActions.querySelectorAll("a")].filter(
    (link) => link.getAttribute("href") === "login.html" || link.getAttribute("href") === "signup.html" || link.textContent === "Get Started"
  );

  if (token) {
    // User is logged in: swap auth links for Dashboard & Logout
    // Keep theme-toggle and menu-toggle, replace intermediate buttons
    const themeToggle = navActions.querySelector("[data-theme-toggle]");
    const menuToggle = navActions.querySelector("[data-menu-toggle]");

    // Rebuild interior actions
    let html = "";
    if (themeToggle) html += themeToggle.outerHTML;

    // Check if we are already on dashboard/builder, if not link to dashboard
    const isMainApp = window.location.pathname.includes("dashboard.html") || window.location.pathname.includes("builder.html");
    if (!isMainApp) {
      html += `<a class="btn btn-outline" href="dashboard.html">Dashboard</a>`;
    }
    
    html += `<button class="btn btn-primary" type="button" data-logout-button>Logout</button>`;
    
    if (menuToggle) html += menuToggle.outerHTML;

    navActions.innerHTML = html;

    // Re-bind theme toggle click handler
    initTheme();

    // Wire up the new dynamic logout button
    const logoutBtn = navActions.querySelector("[data-logout-button]");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }
  }
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
