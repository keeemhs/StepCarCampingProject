const DataTypes = require('sequelize')

const Location = (sequelize) => {
    const location = sequelize.define(
        'location',
        {
            locationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            locationName: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            lon: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            lat: {
                type: DataTypes.STRING(255),
                allowNull: false
            }
        }, {
        timestamps: false
    }
    );
    return location
}

module.exports = Location