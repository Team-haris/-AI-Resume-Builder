const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fullName: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  summary: { type: String, default: "" },
  degree: { type: String, default: "" },
  college: { type: String, default: "" },
  cgpa: { type: String, default: "" },
  year: { type: String, default: "" },
  company: { type: String, default: "" },
  role: { type: String, default: "" },
  experience: { type: String, default: "" },
  skills: { type: String, default: "" },
  softSkills: { type: String, default: "" },
  projectName: { type: String, default: "" },
  projectDescription: { type: String, default: "" },
  certificates: { type: String, default: "" },
  languages: { type: String, default: "" },
  interests: { type: String, default: "" },
  template: { type: String, default: "Modern" },
  atsScore: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Resume", ResumeSchema);
