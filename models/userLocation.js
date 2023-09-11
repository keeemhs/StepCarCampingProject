const DataTypes = require('sequelize');

const userLocation = (sequelize) => {
    const location = sequelize.define(
        'userlocation',
        {
            locationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            lon: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            lat: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            order: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            galleryid: {
                type: DataTypes.INTEGER,
                allowNull: false, //NOT NULL
                foreignKEy: true,
            },
        },
        {
            timestamps: false,
        }
    );
    return location;
};

module.exports = userLocation;
