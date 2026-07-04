import { storage, toast } from "./storage.js";
import { api } from "./api.js";

const steps = ["personal", "education", "experience", "skills", "projects", "certificates", "languages", "interests"];
let resumeId = null;

export async function initResumeBuilder() {
  const form = document.querySelector("[data-resume-form]");
  if (!form) return;

  // 1. Check if we are editing an existing resume
  const urlParams = new URLSearchParams(window.location.search);
  resumeId = urlParams.get("id");

  if (resumeId) {
    toast("Loading resume...", "loading");
    const response = await api.get(`/resume/${resumeId}`);
    if (response.ok && response.resume) {
      const resume = response.resume;
      // Populate form fields with resume details
      Object.entries(resume).forEach(([key, value]) => {
        if (form.elements[key]) {
          form.elements[key].value = value || "";
        }
      });
      toast("Resume loaded successfully.");
    } else {
      toast(response.message || "Failed to load resume details.", "error");
      resumeId = null; // Reset to create new if load fails
    }
  } else {
    // Check if there's a local draft as a fallback
    const saved = storage.get("resumeDraft", {});
    Object.entries(saved).forEach(([key, value]) => {
      if (form.elements[key]) form.elements[key].value = value || "";
    });
  }

  // 2. Initialize step navigation panels
  let currentStep = 0;
  const panels = [...document.querySelectorAll("[data-step]")];
  const progress = document.querySelector("[data-progress]");
  const stepLabel = document.querySelector("[data-step-label]");
  const saveBtn = document.querySelector("[data-save-resume]");

  const updateStep = () => {
    panels.forEach((panel, index) => panel.classList.toggle("active", index === currentStep));
    progress.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    stepLabel.textContent = `${currentStep + 1} of ${steps.length}`;
    document.querySelector("[data-prev]").disabled = currentStep === 0;
    
    const nextBtn = document.querySelector("[data-next]");
    if (currentStep === steps.length - 1) {
      nextBtn.style.display = "none";
      if (saveBtn) saveBtn.style.display = "inline-block";
    } else {
      nextBtn.style.display = "inline-block";
      if (saveBtn) saveBtn.style.display = "none";
    }
  };

  form.addEventListener("input", () => {
    saveDraftLocal(form);
    updatePreview(form);
  });

  document.querySelector("[data-prev]").addEventListener("click", () => {
    currentStep = Math.max(0, currentStep - 1);
    updateStep();
  });

  document.querySelector("[data-next]").addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep = currentStep + 1;
      updateStep();
      saveToServer(form, false); // Autosave to server on step transition
    }
  });

  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      await saveToServer(form, true);
      window.location.href = "dashboard.html";
    });
  }

  // 3. Wire up AI Buttons
  initAiButtons(form);

  // Autosave to server every 15 seconds if authenticated
  window.setInterval(() => {
    saveToServer(form, false);
  }, 15000);

  updatePreview(form);
  updateStep();
}

function saveDraftLocal(form) {
  storage.set("resumeDraft", Object.fromEntries(new FormData(form)));
}

async function saveToServer(form, showToast = false) {
  const data = Object.fromEntries(new FormData(form));
  // Include average/current ATS score if available in metadata
  data.template = storage.get("selectedTemplate", "Modern");

  if (showToast) toast("Saving resume...", "loading");

  let response;
  if (resumeId) {
    // Update existing resume
    response = await api.put(`/resume/${resumeId}`, data);
  } else {
    // Create new resume
    response = await api.post("/resume", data);
  }

  if (response.ok && response.resume) {
    if (!resumeId) {
      resumeId = response.resume.id;
      // Update URL with resume ID without reloading
      const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?id=${resumeId}`;
      window.history.replaceState({ path: newUrl }, "", newUrl);
    }
    if (showToast) toast("Resume saved successfully.");
  } else {
    if (showToast) toast(response.message || "Failed to save resume.", "error");
  }
}

// 4. AI handlers wiring
function initAiButtons(form) {
  // AI Summary Generator
  const aiSummaryBtn = form.querySelector("[data-ai-summary]");
  if (aiSummaryBtn) {
    aiSummaryBtn.addEventListener("click", async () => {
      const skillsVal = form.querySelector("#skills").value;
      if (!skillsVal) {
        toast("Please enter some skills in the Skills step first to help AI write the summary.", "error");
        return;
      }
      toast("AI is writing summary...", "loading");
      const response = await api.post("/ai/generate-summary", { skills: skillsVal });
      if (response.ok && response.summary) {
        form.querySelector("#summary").value = response.summary;
        saveDraftLocal(form);
        updatePreview(form);
        toast("AI Summary updated!");
      } else {
        toast(response.message || "Failed to generate summary.", "error");
      }
    });
  }

  // AI Experience Improver
  const aiExperienceBtn = form.querySelector("[data-ai-experience]");
  if (aiExperienceBtn) {
    aiExperienceBtn.addEventListener("click", async () => {
      const role = form.querySelector("#role").value;
      const company = form.querySelector("#company").value;
      if (!role || !company) {
        toast("Please specify Role and Company first so AI has context.", "error");
        return;
      }
      toast("AI is polishing description...", "loading");
      // Reuse generateProject endpoint to enhance experience responsibilities
      const response = await api.post("/ai/generate-project", { projectName: role, techStack: company });
      if (response.ok && response.projectDescription) {
        form.querySelector("#experience").value = response.projectDescription;
        saveDraftLocal(form);
        updatePreview(form);
        toast("Responsibilities improved!");
      } else {
        toast(response.message || "Failed to improve description.", "error");
      }
    });
  }

  // AI Skills Suggester
  const aiSkillsBtn = form.querySelector("[data-ai-skills]");
  if (aiSkillsBtn) {
    aiSkillsBtn.addEventListener("click", async () => {
      const skillsInput = form.querySelector("#skills").value;
      toast("AI is suggesting skills...", "loading");
      const response = await api.post("/ai/generate-skills", { skillsInput });
      if (response.ok && response.suggestedSkills) {
        form.querySelector("#skills").value = response.suggestedSkills;
        saveDraftLocal(form);
        updatePreview(form);
        toast("Skills suggested!");
      } else {
        toast(response.message || "Failed to suggest skills.", "error");
      }
    });
  }

  // AI Project Enhancer
  const aiProjectBtn = form.querySelector("[data-ai-project]");
  if (aiProjectBtn) {
    aiProjectBtn.addEventListener("click", async () => {
      const projName = form.querySelector("#projectName").value;
      const skillsVal = form.querySelector("#skills").value; // Use tech stack context
      if (!projName) {
        toast("Please enter a Project Name first.", "error");
        return;
      }
      toast("AI is generating description...", "loading");
      const response = await api.post("/ai/generate-project", { projectName: projName, techStack: skillsVal });
      if (response.ok && response.projectDescription) {
        form.querySelector("#projectDescription").value = response.projectDescription;
        saveDraftLocal(form);
        updatePreview(form);
        toast("Project description updated!");
      } else {
        toast(response.message || "Failed to generate project description.", "error");
      }
    });
  }
}

export function initSavedResumePreview() {
  const preview = document.querySelector("[data-saved-preview]");
  if (!preview) return;
  const data = storage.get("resumeDraft", {});
  preview.innerHTML = renderResume(data);
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
    <div class="contact-line">
      ${escapeHtml(text(data.email, "email@example.com"))} | 
      ${escapeHtml(text(data.phone, "+91 00000 00000"))} | 
      ${escapeHtml(text(data.location, "Your City"))}
    </div>
    <section class="resume-section">
      <h3>Summary</h3>
      <p>${escapeHtml(text(data.summary, "AI-ready professional summary will appear here as you write."))}</p>
    </section>
    <section class="resume-section">
      <h3>Education</h3>
      <p>
        <strong>${escapeHtml(text(data.degree, "Degree"))}</strong><br>
        ${escapeHtml(text(data.college, "College / University"))} - ${escapeHtml(text(data.year, "Year"))}
        ${data.cgpa ? `<br>CGPA: ${escapeHtml(data.cgpa)}` : ""}
      </p>
    </section>
    <section class="resume-section">
      <h3>Experience</h3>
      <p>
        <strong>${escapeHtml(text(data.role, "Role"))}</strong> at ${escapeHtml(text(data.company, "Company"))}<br>
        ${escapeHtml(text(data.experience, "Your impact and responsibilities.")).replace(/\n/g, "<br>")}
      </p>
    </section>
    <section class="resume-section">
      <h3>Projects</h3>
      <p>
        <strong>${escapeHtml(text(data.projectName, "Project Name"))}</strong><br>
        ${escapeHtml(text(data.projectDescription, "Project description and technologies.")).replace(/\n/g, "<br>")}
      </p>
    </section>
    <section class="resume-section">
      <h3>Skills</h3>
      <div class="pill-list">
        ${skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}
        ${data.softSkills ? `<br><small class="muted">Soft Skills: ${escapeHtml(data.softSkills)}</small>` : ""}
      </div>
    </section>
    ${data.certificates ? `
    <section class="resume-section">
      <h3>Certificates</h3>
      <p>${escapeHtml(data.certificates).replace(/\n/g, "<br>")}</p>
    </section>` : ""}
    <section class="resume-section">
      <h3>Languages & Interests</h3>
      <p>${escapeHtml(text(data.languages, "English"))} | ${escapeHtml(text(data.interests, "Reading, coding, problem solving"))}</p>
    </section>
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
