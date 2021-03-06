var express = require('express')
const { verifyUser, verifyAdmin } = require('../authenticate')
var router = express.Router()
const Promotions = require('../models/promotions')
const {cors, corsWithOptions} = require('../cors')



router.route('/')
.options(corsWithOptions,(req,res)=>{ res.sendStatus(200)})
    .get(cors,(req,res,next)=>{
        Promotions.find(req.query)
            .then(promos=>{
                res.statusCode = 200
                res.setHeader('Content-Type','application/json')
                res.json(promos)
            },err=>next(err))
            .catch(err=>next(err))
    })
    .post(corsWithOptions,verifyUser,verifyAdmin,(req,res,next)=>{
        Promotions.create(req.body)
            .then(promo=>{
                res.statusCode = 200
                res.setHeader('Content-Type','application/json')
                res.json(promo)
            },err=>next(err))
            .catch(err=>next(err))
    })
    .put(corsWithOptions,verifyUser,verifyAdmin,(req,res)=>{
        res.statusCode = 403    // Forbidden
        res.end('OOps unsupported method')
    })
    .delete(corsWithOptions,verifyUser,verifyAdmin,(req,res,next)=>{
        Promotions.remove({})
            .then(response=>{
                res.statusCode = 200
                res.setHeader('Content-Type','application/json')
                res.json(response)
            },err=>next(err))
            .catch(err=>next(err))
    })

router.route('/:promotionId')
.options(corsWithOptions,(req,res)=>{ res.sendStatus(200)})
    .get(cors,(req,res,next)=>{
        Promotions.findById(req.params.promotionId)
            .then(promo=>{
                res.statusCode = 200
                res.setHeader('Content-Type','application/json')
                res.json(promo)
            },err=>next(err))
            .catch(err=>next(err))
    })
    .post(corsWithOptions,verifyUser,verifyAdmin,(req,res)=>{
        res.statusCode = 403
        res.end('oops method not supported')
    })
    .put(corsWithOptions,verifyUser,verifyAdmin,(req,res)=>{
        Promotions.findByIdAndUpdate(req.params.promotionId,
            {
                $set:req.body
            },{ new:true})
        .then(promo=>{
            res.statusCode = 200
            res.setHeader('Content-Type','application/json')
            res.json(promo)
        },err=>next(err))
        .catch(err=>next(err))
    })
    .delete(corsWithOptions,verifyUser,verifyAdmin,(req,res)=>{
        Promotions.findByIdAndRemove(req.params.promotionId)
        .then(response=>{
            res.statusCode = 200
            res.setHeader('Content-Type','application/json')
            res.json(response)
        },err=>next(err))
        .catch(err=>next(err))
    })


module.exports = router
