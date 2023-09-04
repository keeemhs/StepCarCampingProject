const { DataTypes } = require('sequelize');

const Model = (sequelize) => {
    return sequelize.define('gallery_comment', {
        commentid :{
            type: DataTypes.INTEGER,
            allowNull: false, //NOT NULL
            primaryKey: true,
            autoIncrement: true
        },
        galleryid: {
            type: DataTypes.INTEGER,
            allowNull: false, //NOT NULL
            primaryKey: true,
            foreignKey :true
        },
        nickName : {
            type : DataTypes.STRING(30)
        },
        commentText:{
            //longText 또는 medium Text를 쓰려면 이런식으로 사용한다.
            type :DataTypes.TEXT('long')
        }
    },
    {
        freezeTableName : true,
        //타임스탬프를 찍지 않음.
        timestamps : false,
    });
};


module.exports = Model;
