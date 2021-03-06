var express = require('express')
const { verifyUser, verifyAdmin } = require('../authenticate')
const {cors, corsWithOptions} = require('../cors')
var router = express.Router()
const Dishes = require('../models/dishes')

//   "/dishes routes"
router.route('/')
    .options(corsWithOptions,(req,res)=>{ res.sendStatus(200)})
    .get(cors,(req,res,next)=>{
        Dishes.find(req.query)
            .populate('comments.author')
            .then(dishes=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json')
                res.json(dishes)
            },err=>{
                next(err)
            })
            .catch(err=>{
                next(err)
            })
    })
    .post(corsWithOptions, verifyUser,verifyAdmin,(req,res,next)=>{
        Dishes.create(req.body)
            .then(dish=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json')
                res.json(dish)
            },err=>{
                next(err)
            })
            .catch(err=>{
                next(err)
            })
    })
    .put(corsWithOptions,verifyUser,verifyAdmin,(req,res)=>{
        res.statusCode = 403    // Forbidden
        res.end('Oops '+req.method+" is not supported")
    })
    .delete(corsWithOptions,verifyUser,verifyAdmin,(req,res)=>{
        Dishes.remove({})
            .then(response=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json')
                res.json(response)
            },err=>{
                next(err)
            })
            .catch(err=>{
                next(err)
            })
    })

// "/dishes/:dishId routes"
router.route('/:dishId')
.options(corsWithOptions,(req,res)=>{ res.sendStatus(200)})
    .get(cors,(req,res,next)=>{
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then(dish=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json')
                res.json(dish)
            },err=>{
                next(err)
            })
            .catch(err=>{
                next(err)
            })
    })
    .post(corsWithOptions,verifyUser,verifyAdmin,(req,res)=>{
        res.statusCode = 403    // Forbidden
        res.end('Oops '+req.method+" is not supported")
    })
    .put(corsWithOptions,verifyUser,verifyAdmin,(req,res,next)=>{
        Dishes.findByIdAndUpdate(req.params.dishId,{
                $set:req.body
                },{new:true
            })
            .then(dish=>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then(dish=>{
                    res.statusCode = 200
                    res.setHeader('Content-Type','application/json')
                    res.json(dish)
                })
            },err=>{
                next(err)
            })
            .catch(err=>{
                next(err)
            })
    })
    .delete(corsWithOptions,verifyUser,verifyAdmin,(req,res)=>{
        Dishes.findByIdAndRemove(req.params.dishId)
            .then(response=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json')
                res.json(response)
            },err=>{
                next(err)
            })
            .catch(err=>{
                next(err)
            })
    })

module.exports = router
