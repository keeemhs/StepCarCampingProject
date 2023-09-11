const express = require('express')
const router = express.Router()
const controller = require('../controller/Cspot')

// module.exports = router

module.exports = function (io) {
    //GET
    router.get('/', controller.spot)

    //POST
    router.post('/location', controller.location)

    // io.on('connection', (socket) => {
    //     controller.connection(io, socket);
    // });
    return router
};