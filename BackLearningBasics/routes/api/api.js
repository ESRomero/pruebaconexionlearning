var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportJWT = require('passport-jwt');
var extractJWT = passportJWT.ExtractJwt;
var jwtStrategy = passportJWT.Strategy;


passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey:'ProtossTerranZergEasyGG'
    },
    (payload, next)=>{
        console.log(payload);
        var user = payload;
        return next(null, user);
    }
  )
)

function initApi(db){

    var adminRouter = require('./admin/admin')(db);
    router.use('/admin', adminRouter);
    
    var userRouter = require('./user/user')(db);
    router.use('/user', userRouter);
    var jwtAuthMiddleware = passport.authenticate('jwt',{session:false});
    
    var publicRouter = require('./public/public')(db);
    router.use('/public',publicRouter);

    return router;

}
module.exports = initApi;