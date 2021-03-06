var express = require('express');
var router = express.Router();
const Users = require('../models/users')
const passport = require('passport')
const authenticate = require('../authenticate')
const {cors, corsWithOptions} = require('../cors')


router.options('*',corsWithOptions,(req,res)=>{ res.sendStatus(200)})
router.post('/signup',corsWithOptions,(req,res,next)=>{
    Users.register(new Users({username:req.body.username}),req.body.password,(err,user)=>{
        if(err){
            res.statusCode = 401
            res.setHeader('Content-Type','application/json')
            res.json({
                err:err
            })
        }
        else{
            if(req.body.firstName || req.body.lastName){
                user.firstName = req.body.firstName
                user.lastName = req.body.lastName
            }
            user.save((err,user)=>{
                if(err){
                    res.statusCode = 401
                    res.setHeader('Content-Type','application/json')
                    res.json({
                        err:err
                    })
                    return
                }
                passport.authenticate('local')(req,res,()=>{
                    res.statusCode = 200
                    res.setHeader('Content-Type','application/json')
                    res.json({
                        success:true,
                        message:'You are successfully registered'
                    })
                })
            })
        }
    })
})

router.post('/login',corsWithOptions, (req,res,next)=>{
    passport.authenticate('local', (err, user, info) => {
        if (err)
          return next(err);
    
        if (!user) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Login Unsuccessful!', err: info});
        }
        req.logIn(user, (err) => {
          if (err) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
          }
    
          var token = authenticate.getToken({_id: req.user._id});
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Login Successful!', token: token});
        }); 
      }) (req, res, next);
})

router.get('/logout',corsWithOptions, (req,res,next)=>{
  if(req.session){
    req.session.destroy()
    res.clearCookie('session-id')
    res.redirect('/')
  }
  else{
    var err = new Error('You are not logged in');
    err.status = 403
    return next(err)
  }
 
})

router.get('/',corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, function(req, res, next) {
    Users.find({})
        .then(users=>{
            res.statusCode = 200,
            res.setHeader('Content-Type','application/json')
            res.json(users)
        },err=>next(err))
        .catch(err=>{
            next(err)
        })
  });

router.get('/facebook/token',passport.authenticate('facebook-token'),(req,res)=>{
    if(req.user){
        const token = authenticate.getToken({_id : req.user._id})
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json({
        success:true,
        message:'You are logged in !',
        token:token
    })
    }
})

router.get('/checkJWTtoken', corsWithOptions, (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
      if (err)
        return next(err);
      
      if (!user) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.json({status: 'JWT invalid!', success: false, err: info});
      }
      else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.json({status: 'JWT valid!', success: true, user: user});
  
      }
    }) (req, res);
  });

module.exports = router;
