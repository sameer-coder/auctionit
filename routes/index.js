var express = require('express');
var router = express.Router();
var auction = require('../auction.js');
var users = require('../models/users.js');

String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Crossover App' });
});

router.route('/api/v1/login/:username').get(function(req, res) {
    var username = req.params.username;

    auction.checkIfValidUsername(username, function(result) {
        if (result === true) {
            //check if the user already exists else create new user
            users.createUser(username, function(createId) {
                logger.debug("created user : " + username + " with id : " + createId);
                res.json({ status: 'Loggedin', user: username });
            })
        } else {
            res.status(500).json({ status: 'Error', errorMessage: result });
        }
    });
});



router.route('/api/v1/getAllWidgets/:username').get(function(req, res) {
    var username = req.params.username;

    users.getAllByUsername(username, function(user_details) {
        logger.debug(user_details);
        if (user_details.length == 0) {
            logger.debug("no such user exists");
            if (!res.headersSent) {
                res.json({ status: 'Error', user: username, userDetalis: "No such user" });
            }
        } else {
            if (!res.headersSent) {
                res.json({ status: 'Loggedin', user: username, userDetalis: user_details });
                logger.debug("getAllWidgets : " + user_details);
            }
        }
    })
});



module.exports = router;
