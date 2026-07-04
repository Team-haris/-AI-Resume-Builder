const aiService = require("../services/aiService");

const aiController = {
  async generateSummary(req, res) {
    try {
      const { skills } = req.body;
      if (!skills) {
        return res.status(400).json({ ok: false, message: "Skills input is required." });
      }
      const summary = await aiService.generateSummary(skills);
      res.json({ ok: true, summary });
    } catch (error) {
      console.error("AI Controller (generateSummary) Error:", error.message);
      res.status(500).json({ ok: false, message: error.message || "Failed to generate summary." });
    }
  },

  async generateProject(req, res) {
    try {
      const { projectName, techStack } = req.body;
      if (!projectName) {
        return res.status(400).json({ ok: false, message: "Project name is required." });
      }
      const projectDescription = await aiService.generateProject(projectName, techStack);
      res.json({ ok: true, projectDescription });
    } catch (error) {
      console.error("AI Controller (generateProject) Error:", error.message);
      res.status(500).json({ ok: false, message: error.message || "Failed to generate project description." });
    }
  },

  async generateSkills(req, res) {
    try {
      const { skillsInput } = req.body;
      const suggestedSkills = await aiService.generateSkills(skillsInput);
      res.json({ ok: true, suggestedSkills });
    } catch (error) {
      console.error("AI Controller (generateSkills) Error:", error.message);
      res.status(500).json({ ok: false, message: error.message || "Failed to suggest skills." });
    }
  },

  async getAtsScore(req, res) {
    try {
      const { resumeData } = req.body;
      if (!resumeData) {
        return res.status(400).json({ ok: false, message: "Resume data is required." });
      }
      const atsDetails = await aiService.atsScore(resumeData);
      res.json({ ok: true, atsDetails });
    } catch (error) {
      console.error("AI Controller (getAtsScore) Error:", error.message);
      res.status(500).json({ ok: false, message: error.message || "Failed to calculate ATS score." });
    }
  },

  async improveResume(req, res) {
    try {
      const { resumeData } = req.body;
      if (!resumeData) {
        return res.status(400).json({ ok: false, message: "Resume data is required." });
      }
      const suggestions = await aiService.improveResume(resumeData);
      res.json({ ok: true, suggestions });
    } catch (error) {
      console.error("AI Controller (improveResume) Error:", error.message);
      res.status(500).json({ ok: false, message: error.message || "Failed to generate improvements." });
    }
  }
};

module.exports = aiController;
