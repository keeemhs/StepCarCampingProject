const { DataTypes } = require('sequelize');

const Model = (sequelize) => {
    return sequelize.define(
        'gallery_img',
        {
            imgurl: {
                type: DataTypes.STRING(255),
                allowNull: false, //NOT NULL
                primaryKey: true,
            },
            galleryid: {
                type: DataTypes.INTEGER,
                allowNull: false, //NOT NULL
                primaryKey: true,
                foreignKey: true,
            },
        },
        {
            freezeTableName: true,
            //타임스탬프를 찍지 않음.
            timestamps: false,
        }
    );
};

module.exports = Model;
