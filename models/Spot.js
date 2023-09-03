const DataTypes = require('sequelize')


const Spot = (sequelize) => {
    const model = sequelize.define(
        'spot',
        {
            spotId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            spotName: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            image: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            address: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            information: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            lat: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            lon: {
                type: DataTypes.STRING(255),
                allowNull: false
            },

        }, {
        timestamps: false
    }
    );
    return model
}

module.exports = Spot