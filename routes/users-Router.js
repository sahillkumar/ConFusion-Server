var express = require('express');
var router = express.Router();
const Users = require('../models/users')

router.post('/signup',(req,res,next)=>{
  Users.findOne({username:req.body.username})
    .then(user=>{
        if(user!==null){
          var err = new Error('user '+ user.username +' already exists')
          err.status = 401;
          next(err)
        }
        else{
          return Users.create({
            username:req.body.username,
            password:req.body.password
          })
        }
    })
    .then(user=>{
      res.statusCode = 200
      res.setHeader('Content-Type','text/plain')
      res.json({
        status:'user created successfully',
        user:user
      })
    },err=>next(err))
    .catch(err=>next(err))
})

router.post('/login',(req,res,next)=>{

  if(!req.session.user){

    const authHeader = req.headers.authorization;

    if(!authHeader){
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate','Basic')
      err.status = 401
      return next(err)
    }

    var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':')
    Users.findOne({
      username:auth[0]
    })
    .then(user=>{
      if(user === null){
        var err = new Error('User '+auth[0]+' does not exists !');
        err.status = 403
        return next(err)
      }
      else if(user.password !== auth[1]){
        var err = new Error('Oops Incorrect Password');
        err.status = 403
        return next(err)
      }
      else if(auth[0]===user.username && auth[1]===user.password){
        req.session.user = 'authenticated'
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!')
      }
    },err=>next(err))
    .catch(err=>next(err))
  }
  else{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
  
})

router.get('/logout',(req,res,next)=>{
  if(req.session.user){
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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
