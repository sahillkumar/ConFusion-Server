var express = require('express')
const { verifyUser, verifyAdmin } = require('../authenticate')
var router = express.Router()
const {cors, corsWithOptions} = require('../cors')

const Leaders = require('../models/leaders')


router.route('/') 
.options(corsWithOptions,(req,res)=>{ res.sendStatus(200)})
    .get(cors,(req,res,next)=>{
        Leaders.find(req.query)
            .then(leaders=>{
                res.statusCode = 200
                res.setHeader('Content-Type','application/json')
                res.json(leaders)
            },err=>next(err))
            .catch(err=>next(err))
    })
    .post(corsWithOptions,verifyUser,verifyAdmin,(req,res,next)=>{
        Leaders.create(req.body)
            .then(leader=>{
                res.statusCode = 200
                res.setHeader('Content-Type','application/json')
                res.json(leader)
            },err=>next(err))
            .catch(err=>next(err))
    })
    .put(corsWithOptions,verifyUser,verifyAdmin,(req,res)=>{
        res.statusCode = 403    // Forbidden
        res.end('OOps unsupported method')
    })
    .delete(corsWithOptions,verifyUser,verifyAdmin,(req,res,next)=>{
        Leaders.remove({})
            .then(response=>{
                res.statusCode = 200
                res.setHeader('Content-Type','application/json')
                res.json(response)
            },err=>next(err))
            .catch(err=>next(err))
    })

router.route('/:leaderId')
.options(corsWithOptions,(req,res)=>{ res.sendStatus(200)})
    .get(cors,(req,res,next)=>{
        Leaders.findById(req.params.leaderId)
            .then(leader=>{
                res.statusCode = 200
                res.setHeader('Content-Type','application/json')
                res.json(leader)
            },err=>next(err))
            .catch(err=>next(err))
    })
    .post(corsWithOptions,verifyUser,verifyAdmin,(req,res)=>{
        res.statusCode = 403
        res.end('oops method not supported')
    })
    .put(corsWithOptions,verifyUser,verifyAdmin,(req,res)=>{
        Leaders.findByIdAndUpdate(req.params.leaderId,
            {
                $set:req.body
            },{ new:true})
        .then(leader=>{
            res.statusCode = 200
            res.setHeader('Content-Type','application/json')
            res.json(leader)
        },err=>next(err))
        .catch(err=>next(err))
    })
    .delete(corsWithOptions,verifyUser,verifyAdmin,(req,res)=>{
        Leaders.findByIdAndRemove(req.params.leaderId)
        .then(response=>{
            res.statusCode = 200
            res.setHeader('Content-Type','application/json')
            res.json(response)
        },err=>next(err))
        .catch(err=>next(err))
    })

module.exports = router
