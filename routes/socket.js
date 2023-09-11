const controller = require('../controller/Csocket');

module.exports = function (io) {
    io.on('connection', (socket) => {
        controller.connection(io, socket);
    });
};