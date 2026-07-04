const express = require("express");
const resumeController = require("../controllers/resumeController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Protect all resume routes
router.use(authMiddleware);

router.get("/", resumeController.getAllResumes);
router.get("/:id", resumeController.getResumeById);
router.post("/", resumeController.createResume);
router.put("/:id", resumeController.updateResume);
router.delete("/:id", resumeController.deleteResume);

module.exports = router;
