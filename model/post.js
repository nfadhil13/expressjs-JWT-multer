const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Post = sequelize.define('post' , {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement : true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type : Sequelize.STRING(100),
        allowNull : false
    },
    content : {
        type : Sequelize.TEXT,
        allowNull: false
    },
    imageUrl : {
        type : Sequelize.STRING(100),
        allowNull : false
    }
});

module.exports = Post