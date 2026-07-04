const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Resume = sequelize.define("Resume", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    fullName: { type: DataTypes.STRING, defaultValue: "" },
    email: { type: DataTypes.STRING, defaultValue: "" },
    phone: { type: DataTypes.STRING, defaultValue: "" },
    location: { type: DataTypes.STRING, defaultValue: "" },
    summary: { type: DataTypes.TEXT, defaultValue: "" },
    degree: { type: DataTypes.STRING, defaultValue: "" },
    college: { type: DataTypes.STRING, defaultValue: "" },
    cgpa: { type: DataTypes.STRING, defaultValue: "" },
    year: { type: DataTypes.STRING, defaultValue: "" },
    company: { type: DataTypes.STRING, defaultValue: "" },
    role: { type: DataTypes.STRING, defaultValue: "" },
    experience: { type: DataTypes.TEXT, defaultValue: "" },
    skills: { type: DataTypes.TEXT, defaultValue: "" },
    softSkills: { type: DataTypes.STRING, defaultValue: "" },
    projectName: { type: DataTypes.STRING, defaultValue: "" },
    projectDescription: { type: DataTypes.TEXT, defaultValue: "" },
    certificates: { type: DataTypes.TEXT, defaultValue: "" },
    languages: { type: DataTypes.STRING, defaultValue: "" },
    interests: { type: DataTypes.STRING, defaultValue: "" },
    template: { type: DataTypes.STRING, defaultValue: "Modern" },
    atsScore: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    timestamps: true
  });

  return Resume;
};
