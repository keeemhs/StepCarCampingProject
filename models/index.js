'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};


let sequelize = new Sequelize(config.database, config.username, config.password, config);


db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.gallery=require("./gallery")(sequelize)
db.gallery_img=require("./gallery_img")(sequelize)
db.gallery_comment=require("./gallery_comment")(sequelize)

//갤러리 관계
db.gallery.hasMany(db.gallery_comment,{foreignKey:"galleryid", onDelete:"CASCADE"})
db.gallery_comment.belongsTo(db.gallery,{foreignKey:"galleryid", onDelete:"CASCADE"})

//갤러리 관계
db.gallery.hasMany(db.gallery_img,{foreignKey:"galleryid", onDelete:"CASCADE"})
db.gallery_img.belongsTo(db.gallery,{foreignKey:"galleryid", onDelete:"CASCADE"})

module.exports = db;
