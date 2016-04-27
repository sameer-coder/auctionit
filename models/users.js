var db = require('../db.js')

exports.createUser = function(username, done) {
    var values = [username, 1000, 30, 18, 1, new Date().toISOString()];

    db.get().query('INSERT INTO users (username, coins, breads, carrots , diamonds , lastlogin) VALUES(?,?,?,?,?,? )', values, function(err, result) {
        if (err) return done(err);
        logger.debug(result.insertId);
        done(result.insertId);
    })
}

exports.getAllUsers = function(done) {
    db.get().query('SELECT * FROM users', function(err, rows) {
        if (err) return done(err)
        done(rows)
    })
}

exports.getAllByUsername = function(username, done) {
    db.get().query('SELECT * FROM users WHERE username = ?', username, function(err, rows) {
        // console.log(rows);
        if (err) return done(err)
        done(rows)
    })

    exports.getCurrentAuction = function(done) {
        db.get().query('SELECT * FROM current_auction', function(err, rows) {
            // console.log(rows);
            if (err) return done(err)
            done(rows)
        })
    }
}
