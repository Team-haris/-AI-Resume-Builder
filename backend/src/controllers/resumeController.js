const resumeRepository = require("../repositories/resumeRepository");

const resumeController = {
  async getAllResumes(req, res) {
    try {
      const userId = req.user.id;
      const resumes = await resumeRepository.findAllByUserId(userId);
      res.json({ ok: true, resumes });
    } catch (error) {
      console.error("getAllResumes error:", error.message);
      res.status(500).json({ ok: false, message: "Error fetching resumes." });
    }
  },

  async getResumeById(req, res) {
    try {
      const { id } = req.params;
      const resume = await resumeRepository.findById(id);
      if (!resume) {
        return res.status(404).json({ ok: false, message: "Resume not found." });
      }
      if (resume.userId !== req.user.id) {
        return res.status(403).json({ ok: false, message: "Access denied. Not your resume." });
      }
      res.json({ ok: true, resume });
    } catch (error) {
      console.error("getResumeById error:", error.message);
      res.status(500).json({ ok: false, message: "Error fetching resume." });
    }
  },

  async createResume(req, res) {
    try {
      const userId = req.user.id;
      const resumeData = { ...req.body, userId };

      const resume = await resumeRepository.create(resumeData);
      res.status(201).json({ ok: true, message: "Resume created successfully.", resume });
    } catch (error) {
      console.error("createResume error:", error.message);
      res.status(500).json({ ok: false, message: "Error saving new resume." });
    }
  },

  async updateResume(req, res) {
    try {
      const { id } = req.params;
      const resume = await resumeRepository.findById(id);
      if (!resume) {
        return res.status(404).json({ ok: false, message: "Resume not found." });
      }
      if (resume.userId !== req.user.id) {
        return res.status(403).json({ ok: false, message: "Access denied. Not your resume." });
      }

      const updated = await resumeRepository.update(id, req.body);
      res.json({ ok: true, message: "Resume updated successfully.", resume: updated });
    } catch (error) {
      console.error("updateResume error:", error.message);
      res.status(500).json({ ok: false, message: "Error updating resume." });
    }
  },

  async deleteResume(req, res) {
    try {
      const { id } = req.params;
      const resume = await resumeRepository.findById(id);
      if (!resume) {
        return res.status(404).json({ ok: false, message: "Resume not found." });
      }
      if (resume.userId !== req.user.id) {
        return res.status(403).json({ ok: false, message: "Access denied. Not your resume." });
      }

      const deleted = await resumeRepository.delete(id);
      if (deleted) {
        res.json({ ok: true, message: "Resume deleted successfully." });
      } else {
        res.status(500).json({ ok: false, message: "Failed to delete resume." });
      }
    } catch (error) {
      console.error("deleteResume error:", error.message);
      res.status(500).json({ ok: false, message: "Error deleting resume." });
    }
  }
};

module.exports = resumeController;
