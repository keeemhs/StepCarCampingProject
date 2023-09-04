const { DataTypes } = require('sequelize');

const Model = (sequelize) => {
    return sequelize.define('socketio', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false, //NOT NULL
            primaryKey: true,
            autoIncrement: true,
        },
    });
};

module.exports = Model;
