import { api } from "./api.js";
import { toast } from "./storage.js";

export async function initDashboard() {
  // 1. Personalize dashboard welcome greeting
  const sessionData = sessionStorage.getItem("airb:session");
  if (sessionData) {
    const user = JSON.parse(sessionData);
    const welcomeHeader = document.querySelector(".welcome-card h1");
    if (welcomeHeader) {
      welcomeHeader.textContent = `Welcome back, ${user.name || "Haris"}`;
    }
  }

  const resumeListContainer = document.querySelector(".resume-list");
  const analyticsContainer = document.querySelector("[data-analytics]");
  if (!resumeListContainer) return;

  // 2. Fetch resumes from backend
  const response = await api.get("/resume");
  if (!response.ok) {
    resumeListContainer.innerHTML = `<div class="error-msg">${response.message || "Failed to load resumes."}</div>`;
    return;
  }

  const resumes = response.resumes || [];

  // 3. Update dashboard stats dynamically
  updateStats(resumes);

  // 4. Render Resumes
  if (resumes.length === 0) {
    resumeListContainer.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 20px;">
        <p class="muted">You haven't created any resumes yet.</p>
        <a class="btn btn-primary" href="builder.html" style="margin-top: 10px; display: inline-block;">Create Your First Resume</a>
      </div>
    `;
    if (analyticsContainer) {
      analyticsContainer.innerHTML = `<p class="muted" style="text-align: center;">No resumes to analyze.</p>`;
    }
    return;
  }

  // Render recent resumes list
  resumeListContainer.innerHTML = resumes.map((resume) => {
    const dateStr = new Date(resume.updatedAt || resume.createdAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    return `
      <div class="resume-row" data-id="${resume.id}">
        <div>
          <strong>${escapeHtml(resume.fullName || "Untitled Resume")}</strong>
          <p>${escapeHtml(resume.role || "No Role Specified")} • Edited ${dateStr}</p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <a class="btn btn-outline" href="builder.html?id=${resume.id}">Edit</a>
          <button class="btn btn-danger btn-delete" data-id="${resume.id}" style="padding: 6px 12px; font-size: 0.85rem; border-radius: 8px;">Delete</button>
        </div>
      </div>
    `;
  }).join("");

  // Attach delete handlers
  resumeListContainer.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", handleDeleteResume);
  });

  // 5. Render analytics chart (ATS Score progress bars)
  if (analyticsContainer) {
    analyticsContainer.innerHTML = resumes.slice(0, 4).map((resume) => {
      const score = resume.atsScore || 70;
      return `
        <div class="progress-item" style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <strong>${escapeHtml(resume.fullName || "Untitled")}</strong>
            <small class="muted">ATS score ${score}%</small>
          </div>
          <div class="analytics-bar"><span style="width:${score}%"></span></div>
        </div>
      `;
    }).join("");
  }
}

function updateStats(resumes) {
  const statsElements = document.querySelectorAll(".stat-card");
  if (statsElements.length < 4) return;

  const totalResumes = resumes.length;
  
  // Calculate average ATS Score
  const totalScore = resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0);
  const avgAts = totalResumes > 0 ? Math.round(totalScore / totalResumes) : 0;
  
  // Count unique templates
  const uniqueTemplates = new Set(resumes.map(r => r.template || "Modern")).size;

  // Render stats
  statsElements[0].querySelector("strong").textContent = totalResumes;
  statsElements[1].querySelector("strong").textContent = `${avgAts}%`;
  statsElements[2].querySelector("strong").textContent = totalResumes * 3; // Simulated download count
  statsElements[3].querySelector("strong").textContent = uniqueTemplates;
}

async function handleDeleteResume(event) {
  const id = event.target.dataset.id;
  if (!confirm("Are you sure you want to delete this resume? This cannot be undone.")) return;

  toast("Deleting resume...", "loading");
  const response = await api.delete(`/resume/${id}`);
  if (response.ok) {
    toast("Resume deleted successfully.");
    // Remove element from DOM
    const row = document.querySelector(`.resume-row[data-id="${id}"]`);
    if (row) {
      row.remove();
    }
    // Refresh stats
    initDashboard();
  } else {
    toast(response.message || "Failed to delete resume.", "error");
  }
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}
