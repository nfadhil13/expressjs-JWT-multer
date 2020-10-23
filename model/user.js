const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type : Sequelize.STRING(100),
        allowNull : false
    },
    password : {
        type : Sequelize.STRING(100),
        allowNull: false
    },
    name : {
        type : Sequelize.STRING(100),
        allowNull : false
    },
    status : {
        type : Sequelize.STRING(30),
        defaultValue : "Hello i am new"
    }
});

module.exports = User
