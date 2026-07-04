const defineUser = require("./User");
const defineResume = require("./Resume");

const models = {};

async function initSqlModels(sequelize) {
  const User = defineUser(sequelize);
  const Resume = defineResume(sequelize);

  // Setup relationships
  User.hasMany(Resume, { foreignKey: "userId", onDelete: "CASCADE" });
  Resume.belongsTo(User, { foreignKey: "userId" });

  models.User = User;
  models.Resume = Resume;

  // Synchronize models with SQLite file
  await sequelize.sync();
  console.log("SQL Database schemas synchronized.");
}

module.exports = {
  initSqlModels,
  models
};
