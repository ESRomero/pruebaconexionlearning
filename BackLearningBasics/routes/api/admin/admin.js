var express = require('express');
var router = express.Router();

function initAdmin(db){
    var coursesRouter = require('./courses/courses')(db);
    var payment = require('./payment/payment')(db);
    var usersRouter = require('./users/users')(db);
    var accessRouter = require('./Access/access')(db);
    router.use('/courses', coursesRouter);
    router.use('/payment',payment);
    router.use('/users', usersRouter);
    router.use('/access',accessRouter);

    return router;

}
module.exports = initAdmin;