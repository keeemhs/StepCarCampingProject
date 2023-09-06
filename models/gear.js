const { DataTypes } = require('sequelize');

const Gear = (sequelize) => {
    const model = sequelize.define('gear', {
        gearid: {
            type: DataTypes.INTEGER,
            allowNull: false, //NOT NULL
            primaryKey: true,
            autoIncrement: true,
        },
        gearTitle: {
            type: DataTypes.STRING(45),
            allowNull: false, //NOT NULL
        },
        gearExplain: {
            type: DataTypes.STRING(255),
            allowNull: false, //NOT NULL
        },
    });
    return model;
};

module.exports = Gear;
