const express = require('express');
const router = express.Router();
const controller = require('../controller/Cspot');

router.get('/', controller.spot);

//POST
router.post('/location', controller.location);

module.exports = router;
module.exports.io = function (io) {
    io.on('connection', (socket) => {
        controller.connection(io, socket);
    });
};
