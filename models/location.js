const { DataTypes } = require('sequelize');

const Model = (sequelize) => {
    return sequelize.define('location', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false, //NOT NULL
            primaryKey: true,
            autoIncrement: true,
        },

    });
};

module.exports = Model;
