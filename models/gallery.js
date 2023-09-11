const { DataTypes } = require('sequelize');

const Model = (sequelize) => {
    return sequelize.define(
        'gallery',
        {
            galleryid: {
                type: DataTypes.INTEGER,
                allowNull: false, //NOT NULL
                primaryKey: true,
                autoIncrement: true,
            },
            userid: {
                type: DataTypes.INTEGER,
                allowNull: false, //NOT NULL
                foreignKey: true, // user table 없어서 주석처리
            },
            title: {
                type: DataTypes.STRING('255'),
                allowNull: false,
            },
            mainText: {
                //longText 또는 medium Text를 쓰려면 이런식으로 사용한다.
                type: DataTypes.TEXT('long'),
            },
            region: {
                type: DataTypes.STRING('10'),
                allowNull: false,
            },
            spotInform: {
                type: DataTypes.STRING('30'),
                allowNull: false,
            },
            thunmnail: {
                type: DataTypes.STRING('255'),
            },
            views: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0, //기본값
            },
        },
        {
            freezeTableName: true,
        }
    );
};

module.exports = Model;
