const express = require('express')
const { verifyUser } = require('../authenticate')
const { corsWithOptions } = require('../cors')
const router = express.Router()
const Favourites = require('../models/favorites')

router.route('/')
.options(corsWithOptions,(req,res)=>{res.sendStatus(200)})
.get(corsWithOptions,verifyUser,(req,res,next)=>{
    Favourites.findOne({user:req.user._id})
        .populate('user')
        .populate('dishes')
        .then(fav=>{
            if(fav==null){
                var err = new Error('No Favourites')
                err.status = 404
                return next(err)
            }
            res.statusCode = 200
            res.setHeader('Content-Type','application/json')
            res.json(fav)
        },err=>next(err))
})
.post(corsWithOptions,verifyUser,(req,res,next)=>{
    Favourites.findOne({user:req.user._id})
        .then(fav=>{
            if(fav !== null){
                const dishes = req.body
                for(var i=0;i<dishes.length;i++){
                    if(fav.dishes.indexOf(dishes[i]._id) === -1){
                        fav.dishes.push(dishes[i]._id)
                    }
                }
                fav.save((err,favorite)=>{
                    if(err){
                        return next(err)
                    }
                    Favourites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                },err=>next(err))
            }else{
                const favourite = new Favourites({user:req.user._id})
                const dishes = req.body
                console.log(dishes);
                for(var i=0;i<dishes.length;i++){
                    favourite.dishes.push(dishes[i]._id)
                }
                favourite.save((err,favorite)=>{
                    if(err){
                        return next(err)
                    }
                    Favourites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                },err=>next(err))
            }
        })
        .catch(err=>next(err))
})
.delete(verifyUser,(req,res,next)=>{
    Favourites.findOneAndRemove({user:req.user._id})
        .then(favourite=>{
            res.statusCode = 200
            res.setHeader('Content-Type','application/json')
            res.json(favourite)
        },err=>next(err))
})



router.route('/:dishId')
.options(corsWithOptions,(req,res)=>{res.sendStatus(200)})
.get(corsWithOptions,verifyUser,(req,res)=>{
    Favourites.findOne({user:req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(corsWithOptions,verifyUser,(req,res,next)=>{
    Favourites.findOne({user:req.user._id})
        .then(fav=>{
            if(fav == null){
                Favourites.create({
                    user:req.user._id,
                    dishes:[req.params.dishId]
                })
                .then(favorite=>{
                    Favourites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                },err=>next(err))
            }else{
                if(fav.dishes.indexOf(req.params.dishId) === -1)
                {
                    fav.dishes.push(req.params.dishId)
                    fav.save((err,favorite)=>{
                        if(err){
                            return next(err)
                        }
                        Favourites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                         })
                    },err=>next(err))
                }else{
                    var err = new Error('Dish already in favourites')
                    err.staus = 404
                    return next(err)
                }
            }
        })
        .catch(err=>next(err))
})
.delete(corsWithOptions,verifyUser,(req,res,next)=>{
    Favourites.findOne({user:req.user._id})
        .then(favourite=>{
            if(favourite != null){
                favourite.dishes.pull(req.params.dishId)
                if(favourite.dishes.length === 0){
                    Favourites.findByIdAndRemove(favourite._id)
                        .populate('user')
                        .populate('dishes')
                        .then(favourite=>{
                            res.statusCode = 200
                            res.setHeader('Content-Type','application/json')
                            res.json(favourite)
                        },err=>next(err))
                }else{
                    favourite.save()
                    .then(favorite=>{
                        Favourites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                         })
                    },err=>next(err))
                }
            }else{
                var err = new Error('You have No favourites to delete')
                err.status = 404
                return next(err)
            }
        })
        .catch(err=>next(err))
})

module.exports = router