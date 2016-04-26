String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
};

module.exports = {

    checkIfValidUsername: function(username, callback) {

    if(username.match(/[_\W0-9]/)) {
            logger.debug("Error : Username can only contain letters");
            return callback("Error : Username can only contain letters");
        } else {
            return callback(true);
        }
    },


};
