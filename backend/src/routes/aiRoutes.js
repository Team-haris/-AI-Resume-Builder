const express = require("express");
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Require authorization for AI requests to prevent API abuse
router.use(authMiddleware);

router.post("/generate-summary", aiController.generateSummary);
router.post("/generate-project", aiController.generateProject);
router.post("/generate-skills", aiController.generateSkills);
router.post("/ats-score", aiController.getAtsScore);
router.post("/improve-resume", aiController.improveResume);

module.exports = router;
