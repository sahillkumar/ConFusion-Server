var express = require('express')
const { verifyUser, verifyAdmin } = require('../authenticate')
var router = express.Router()
var multer = require('multer')
const { corsWithOptions,cors } = require('../cors')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/images/')
      },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

var fileFilter = (req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }else{
        cb(null,true)
    }
}

var upload = multer({storage,fileFilter,limits:{fileSize:6500000}})


router.route('/')
.options(corsWithOptions,(req,res)=>{ res.sendStatus(200)})
    .get(cors,verifyUser,(req,res)=>{
        res.statusCode = 403    // Forbidden
        res.end('Oops '+req.method+" is not supported")
    })
    .post(corsWithOptions, verifyUser,verifyAdmin,upload.single('imageFile'),(req,res)=>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file)
    })
    .put(corsWithOptions, verifyUser,verifyAdmin,(req,res)=>{
        res.statusCode = 403    // Forbidden
        res.end('Oops '+req.method+" is not supported")
    })
    .delete(corsWithOptions, verifyUser,verifyAdmin,(req,res)=>{
        res.statusCode = 403    // Forbidden
        res.end('Oops '+req.method+" is not supported")
    })

    module.exports = router