const SequelizeObject = require("sequelize");
const mysql = require("mysql2");
const pg = require("pg");
require("dotenv").config();

const dialectModule = { mysql: mysql, postgres: pg };

const dbConfig = {
  database_name: process.env.DB_NAME || "hng-database",
  database_user: process.env.DB_USER || "root",
  database_password: process.env.DB_PASSWORD || "0756abwmB$",
  database_host: process.env.DB_HOST || "localhost",
  database_port: process.env.DB_PORT || 3306,
  database_pool: {
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  database_dialect: process.env.DB_DIALECT || "mysql",
  database_dialect_module: dialectModule[process.env.DIALECT_MODULE],
  database_dialect_options: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

const sequelize = new SequelizeObject(
  dbConfig.database_name,
  dbConfig.database_user,
  dbConfig.database_password,
  {
    host: dbConfig.database_host,
    port: dbConfig.database_port,
    dialect: dbConfig.database_dialect,
    dialectModule: dbConfig.database_dialect_module,
    dialectOptions: dbConfig.database_dialect_options,
    pool: dbConfig.database_pool,
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error("Unable to connect to the database:", err));

const db = {};
db.Sequelize = SequelizeObject;
db.sequelize = sequelize;

db.userModel = require("./userModel")(sequelize, SequelizeObject);
db.orgModel = require("./orgModel")(sequelize, SequelizeObject);

db.userModel.belongsToMany(db.orgModel, {
  through: "userOrganisation",
  foreignKey: "userId",
  as: "organisations",
});

db.orgModel.belongsToMany(db.userModel, {
  through: "userOrganisation",
  foreignKey: "orgId",
  as: "users",
});

module.exports = db;
