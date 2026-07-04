const MongoResume = require("../models/mongo/Resume");
const { models: sqlModels } = require("../models/sql");

function getDbType() {
  return process.env.DB_TYPE || "sql";
}

function normalize(resume) {
  if (!resume) return null;
  if (getDbType() === "mongodb") {
    const r = resume.toObject ? resume.toObject() : resume;
    r.id = r._id.toString();
    return r;
  }
  return resume.toJSON ? resume.toJSON() : resume;
}

const resumeRepository = {
  async findAllByUserId(userId) {
    const dbType = getDbType();
    if (dbType === "mongodb") {
      const resumes = await MongoResume.find({ userId }).sort({ createdAt: -1 });
      return resumes.map(normalize);
    } else {
      const resumes = await sqlModels.Resume.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]]
      });
      return resumes.map(normalize);
    }
  },

  async findById(id) {
    const dbType = getDbType();
    try {
      if (dbType === "mongodb") {
        const resume = await MongoResume.findById(id);
        return normalize(resume);
      } else {
        const resume = await sqlModels.Resume.findByPk(id);
        return normalize(resume);
      }
    } catch (err) {
      return null;
    }
  },

  async create(resumeData) {
    const dbType = getDbType();
    if (dbType === "mongodb") {
      const resume = new MongoResume(resumeData);
      const saved = await resume.save();
      return normalize(saved);
    } else {
      const resume = await sqlModels.Resume.create(resumeData);
      return normalize(resume);
    }
  },

  async update(id, resumeData) {
    const dbType = getDbType();
    if (dbType === "mongodb") {
      const updated = await MongoResume.findByIdAndUpdate(id, resumeData, { new: true });
      return normalize(updated);
    } else {
      const resume = await sqlModels.Resume.findByPk(id);
      if (!resume) return null;
      await resume.update(resumeData);
      return normalize(resume);
    }
  },

  async delete(id) {
    const dbType = getDbType();
    if (dbType === "mongodb") {
      const deleted = await MongoResume.findByIdAndDelete(id);
      return !!deleted;
    } else {
      const rowsDeleted = await sqlModels.Resume.destroy({ where: { id } });
      return rowsDeleted > 0;
    }
  }
};

module.exports = resumeRepository;
