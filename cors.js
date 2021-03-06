const cors = require('cors')

var whiteList = ['https://localhost:3443','http://localhost:3000','http://localhost:3001']
const corsOptionDelegates = (req, cb)=>{
    var corsOptions;
    if(whiteList.indexOf(req.header('Origin')) !== -1){
        corsOptions = { origin : true}
    }else{
        corsOptions = { origin : false}
    }
    console.log(req.header('Origin'));
    console.log(whiteList.indexOf(req.header('Origin')));
    cb(null,corsOptions)
}

exports.cors = cors()
exports.corsWithOptions = cors(corsOptionDelegates)