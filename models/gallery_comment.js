const { DataTypes } = require('sequelize');

const Model = (sequelize) => {
    return sequelize.define(
        'gallery_comment',
        {
            commentid: {
                type: DataTypes.INTEGER,
                allowNull: false, //NOT NULL
                primaryKey: true,
                autoIncrement: true,
            },

            nickName: {
                type: DataTypes.STRING(30),
                allowNull: false, //NOT NULL
            },
            commentText: {
                //longText 또는 medium Text를 쓰려면 이런식으로 사용한다.
                type: DataTypes.TEXT('long'),
                allowNull: false, //NOT NULL
            },

            commentGroup: {
                type: DataTypes.INTEGER,
                allowNull: false, //NOT NULL
            },

            deepComment: {
                type: DataTypes.INTEGER,
                allowNull: false, //NOT NULL
                defaultValue: -1,
            },

            galleryid: {
                type: DataTypes.INTEGER,
                allowNull: false, //NOT NULL
                // primaryKey: true,
                foreignKey: true,
            },
            userid: {
                type: DataTypes.INTEGER,
                allowNull: false, //NOT NULL
                foreignKey: true, //  user table 없어서 주석처리
                // autoIncrement: true,
            },
        },
        {
            freezeTableName: true,
            //타임스탬프를 찍지 않음.
            timestamps: true,
        }
    );
};

module.exports = Model;
