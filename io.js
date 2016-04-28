var io = require('socket.io')(); // yes, no server arg here; it's not required
// attach stuff to io
module.exports = io;