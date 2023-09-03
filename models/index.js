'use strict';


const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/config.json')['development'];
const db = {};


const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Spot = require('./Spot')(sequelize)
db.Location = require('./Location')(sequelize)

db.Location.hasMany(db.Spot)
db.Spot.belongsTo(db.Location)

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
