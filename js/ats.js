import { api } from "./api.js";
import { toast } from "./storage.js";

export async function initATS() {
  const selectContainer = document.getElementById("resume-selector-container");
  const resumeSelect = document.getElementById("resume-select");
  const heroCard = document.querySelector("[data-ats-hero-card]");
  const detailsGrid = document.getElementById("ats-details-grid");
  const noResumesState = document.getElementById("no-resumes-state");

  if (!resumeSelect) return;

  // 1. Fetch user's resumes
  const response = await api.get("/resume");
  if (!response.ok) {
    toast(response.message || "Failed to load resumes for ATS check.", "error");
    return;
  }

  const resumes = response.resumes || [];

  if (resumes.length === 0) {
    // Show empty state
    if (selectContainer) selectContainer.style.display = "none";
    if (heroCard) heroCard.style.display = "none";
    if (detailsGrid) detailsGrid.style.display = "none";
    if (noResumesState) noResumesState.style.display = "block";
    return;
  }

  // Resumes exist
  if (noResumesState) noResumesState.style.display = "none";
  if (selectContainer) selectContainer.style.display = "flex";
  if (heroCard) heroCard.style.display = "grid";

  // Populate select dropdown
  resumeSelect.innerHTML = resumes.map((resume, idx) => {
    const title = resume.fullName || `Untitled Resume ${idx + 1}`;
    const subtitle = resume.role ? ` (${resume.role})` : "";
    return `<option value="${resume.id}">${escapeHtml(title + subtitle)}</option>`;
  }).join("");

  // Handler for resume change
  resumeSelect.addEventListener("change", async (e) => {
    const selectedId = e.target.value;
    const selectedResume = resumes.find(r => r.id === selectedId);
    if (selectedResume) {
      await runAnalysis(selectedResume);
    }
  });

  // Run analysis automatically for the first resume
  await runAnalysis(resumes[0]);
}

async function runAnalysis(resume) {
  const ring = document.querySelector("[data-ats-ring]");
  const headerInfo = document.querySelector("[data-ats-header-info]");
  const detailsGrid = document.getElementById("ats-details-grid");

  if (!ring || !headerInfo) return;

  // Set loading state
  ring.style.setProperty("--score", `0%`);
  ring.querySelector("span").textContent = "...";
  
  headerInfo.innerHTML = `
    <span class="eyebrow">ATS Score</span>
    <h1>Analyzing "${escapeHtml(resume.fullName || "Untitled")}"...</h1>
    <p>AI is scanning formatting, structure, and keyword density. Please hold on...</p>
  `;
  if (detailsGrid) detailsGrid.style.display = "none";

  // Call backend AI ATS analysis
  const response = await api.post("/ai/ats-score", { resumeData: resume });
  if (!response.ok || !response.atsDetails) {
    toast(response.message || "Failed to analyze resume.", "error");
    ring.querySelector("span").textContent = "N/A";
    headerInfo.innerHTML = `
      <span class="eyebrow">ATS Score</span>
      <h1>Analysis Failed</h1>
      <p>We encountered an issue running the AI scanning tools. Please try again.</p>
    `;
    return;
  }

  const details = response.atsDetails;
  const score = Number(details.score || 70);

  // Update ring score
  ring.style.setProperty("--score", `${score}%`);
  ring.querySelector("span").textContent = `${score}%`;

  // Determine status message
  let statusText = "Needs Improvement";
  let statusColor = "#ef4444"; // red
  let statusDesc = "Your resume has critical formatting or keyword gaps. Review the recommendations below to improve your score.";

  if (score >= 85) {
    statusText = "Strong";
    statusColor = "#10b981"; // success green
    statusDesc = "Excellent! Your resume has outstanding keyword alignment, formatting, and structural metrics. It is highly ready for job portals.";
  } else if (score >= 70) {
    statusText = "Good";
    statusColor = "#06b6d4"; // cyan
    statusDesc = "Good work. The resume satisfies basic criteria, but missing industry keywords are capping your score. Add them to reach 90%+.";
  }

  headerInfo.innerHTML = `
    <span class="eyebrow">ATS Score</span>
    <h1 style="color: ${statusColor}">Resume Health Status: ${statusText}</h1>
    <p>${statusDesc}</p>
    <a class="btn btn-primary" href="builder.html?id=${resume.id}">Improve Resume</a>
  `;

  // Render Strengths
  const strengthsCard = document.querySelector("[data-strengths-card]");
  if (strengthsCard) {
    const list = strengthsCard.querySelector(".strengths-list");
    list.innerHTML = (details.strengths || ["Proper layout structure"]).map(str => `
      <div class="progress-item" style="border-left: 4px solid #10b981; padding-left: 10px; margin-bottom: 8px;">
        <span style="font-weight: 500;">${escapeHtml(str)}</span>
      </div>
    `).join("");
  }

  // Render Weaknesses
  const weaknessesCard = document.querySelector("[data-weaknesses-card]");
  if (weaknessesCard) {
    const list = weaknessesCard.querySelector(".weaknesses-list");
    list.innerHTML = (details.weaknesses || ["Lacks quantified achievements"]).map(weak => `
      <div class="progress-item" style="border-left: 4px solid #ef4444; padding-left: 10px; margin-bottom: 8px;">
        <span style="font-weight: 500;">${escapeHtml(weak)}</span>
      </div>
    `).join("");
  }

  // Render Missing Keywords
  const keywordsCard = document.querySelector("[data-missing-keywords-card]");
  if (keywordsCard) {
    const list = keywordsCard.querySelector(".keyword-list");
    const keywords = details.missingKeywords || [];
    if (keywords.length === 0) {
      list.innerHTML = `<span style="color: #10b981; font-weight: 500;">No critical keywords missing!</span>`;
    } else {
      list.innerHTML = keywords.map(kw => `<span>${escapeHtml(kw)}</span>`).join("");
    }
  }

  // Render Suggestions
  const suggestionsCard = document.querySelector("[data-suggestions-card]");
  if (suggestionsCard) {
    const list = suggestionsCard.querySelector(".suggestions-list");
    list.innerHTML = (details.suggestions || ["Add measurable numbers to experience."]).map(sug => `
      <li style="margin-bottom: 8px;">${escapeHtml(sug)}</li>
    `).join("");
  }

  // Display details grid
  if (detailsGrid) detailsGrid.style.display = "grid";

  // Update ATS score back in database silently for dashboard syncing
  api.put(`/resume/${resume.id}`, { atsScore: score }).catch(err => {
    console.warn("Failed to sync updated ATS score with backend:", err);
  });
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
