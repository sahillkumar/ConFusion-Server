const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Users= require('./models/users')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken')
const config = require('./config')
const FacebookStrategy = require('passport-facebook-token')


exports.getToken = (user)=>{
    return jwt.sign(user,config.secretKey,{expiresIn:3600})
}

passport.use(new LocalStrategy(Users.authenticate()))
passport.serializeUser(Users.serializeUser())
passport.deserializeUser(Users.deserializeUser())

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{
    Users.findOne({_id:jwt_payload._id},(err,user)=>{
        if(err){
            return done(err,false);
        }
        else if(user)
        {
            return done(null,user)
        }
        else{
            return done(null,false)
        }
    })
}))

passport.use(new FacebookStrategy({ 
    clientID: config.facebook.clientId, 
    clientSecret:config.facebook.clientSecret,
    profileFields:["id","email","name",'displayName']
    },
        (accessToken,refreshToken,profile,done)=>{
            console.log('accesstoken : ',accessToken);
            console.log('profile ',profile);
            Users.findOne({facebookId:profile.id},(err,user)=>{
                if(err){
                    return done(err,false)
                }else if( !err && user !== null){
                    return done(null,user)
                }else{
                    const user = new Users({username:profile.displayName})
                    user.facebookId=profile.id
                    user.firstName = profile.name.givenName
                    user.lastName = profile.name.familyName
                    user.save((err,user)=>{
                        if(err)
                            return done(err,false)
                        else
                            return done(null,user)
                        }
                    )
                }
            })
        }))

exports.verifyUser = passport.authenticate('jwt',{ session :false})

exports.verifyAdmin = (req,res,next)=>{
    if(req.user.admin){
        next()
    }
    else{
        var err = new Error('You are not Admin')
        err.status = 403
        next(err)
    }
}
