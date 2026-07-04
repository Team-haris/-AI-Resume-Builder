const MongoUser = require("../models/mongo/User");
const { models: sqlModels } = require("../models/sql");

function getDbType() {
  return process.env.DB_TYPE || "sql";
}

const userRepository = {
  async findByEmail(email) {
    const dbType = getDbType();
    if (dbType === "mongodb") {
      const user = await MongoUser.findOne({ email });
      if (!user) return null;
      const u = user.toObject();
      u.id = u._id.toString();
      return u;
    } else {
      const user = await sqlModels.User.findOne({ where: { email } });
      if (!user) return null;
      return user.toJSON();
    }
  },

  async findById(id) {
    const dbType = getDbType();
    if (dbType === "mongodb") {
      const user = await MongoUser.findById(id);
      if (!user) return null;
      const u = user.toObject();
      u.id = u._id.toString();
      return u;
    } else {
      const user = await sqlModels.User.findByPk(id);
      if (!user) return null;
      return user.toJSON();
    }
  },

  async create(userData) {
    const dbType = getDbType();
    if (dbType === "mongodb") {
      const user = new MongoUser(userData);
      const saved = await user.save();
      const u = saved.toObject();
      u.id = u._id.toString();
      return u;
    } else {
      const user = await sqlModels.User.create(userData);
      return user.toJSON();
    }
  }
};

module.exports = userRepository;
