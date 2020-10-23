const { Sequelize } = require("sequelize");

const config = require("./dbconfig.js")



const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  dialect: config.dialect,
  host: config.host,
  port: config.port,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});




module.exports = sequelize;