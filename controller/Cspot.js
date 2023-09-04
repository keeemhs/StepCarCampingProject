const { Location, Spot } = require('../models')

///////////////////////GET///////////////////////
exports.spot = (req, res) => {
    res.render('spot')
}



///////////////////////POST///////////////////////
exports.location = async (req, res) => {
    const location = await Location.findOne({
        where: {
            locationName: req.body.location
        }
    })

    const spot = await Spot.findAll({
        where: {
            locationLocationId: location.locationId
        }
    })

    res.send({ location, spot })
}