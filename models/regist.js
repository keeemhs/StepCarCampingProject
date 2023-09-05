const { DataTypes } = require('sequelize');

const GearModel = (sequelize) => {
    return sequelize.define('regist', {
        id: {
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
        startDate: {
            type: DataTypes.DATE,
            allowNull: false, //NOT NULL
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true, //NULL
        },
        rentPossible: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
};

module.exports = GearModel;
