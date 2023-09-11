const {
    DataTypes
} = require('sequelize');

const User = (sequelize) => {
    const model = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false, //NOT NULL
            primaryKey: true,
            autoIncrement: true,
        },
        useremail: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        pw: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        birth: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        nickname: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        levelc: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ownc: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        timestamps: false,
    });
    return model
};

module.exports = User