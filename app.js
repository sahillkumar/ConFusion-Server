var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
// const session = require('express-session')
// const fileStore = require('session-file-store')(session)
const passport = require('passport')
const authenticate = require('./authenticate')
const config = require('./config');

//Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRouter');
var dishRouter = require('./routes/dishRouter')
var promoRouter = require("./routes/promoRouter")
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');
var favouriteRouter = require('./routes/favouriteRouter')
var commentRouter = require('./routes/commentRouter')
//connecting to mongodb
const url = config.mongoUrl

mongoose.Promise = global.Promise;
mongoose.connect(url,{useMongoClient:true})
  .then(()=>{
    console.log('Connected successfully with the database');
  },err=>{
  console.log('Error is :'+err);
})


//setting up express server
var app = express();

app.all('*',(req,res,next)=>{
  if(req.secure){
   return next()
  }else{
    res.redirect(307,'https://'+req.hostname+':'+app.get('secPort')+req.url)
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//using middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('Mysecretlooooool'));


// app.use(session({
//   name:'session-id',
//   saveUninitialized:false,
//   resave:false,
//   secret:'llallalljalsfjaslfjalsjfasldfj',
//   store: new fileStore({logFn: function(){}})
// }))


app.use(passport.initialize())
// app.use(passport.session())
app.use('/', indexRouter);
app.use('/users', usersRouter);


//session auth

// const auth = (req,res,next)=>{

//   if(!req.user){
//     var err = new Error('You are not authenticated!');  
//     err.status = 403;
//     return next(err)
//   }
//   else{
//     next()
//   }
// }

// app.use(auth)
app.use(express.static(path.join(__dirname, 'public')));

//using routes

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload',uploadRouter);
app.use('/favorites',favouriteRouter)
app.use('/comments',commentRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
 
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
