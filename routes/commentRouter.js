var express = require('express')
const { verifyUser, verifyAdmin } = require('../authenticate')
const {cors, corsWithOptions} = require('../cors')
var router = express.Router()
const Comments = require('../models/comments')

router.route('/')
.options(corsWithOptions,(req,res)=>{ res.sendStatus(200)})
    .get(cors,(req,res,next)=>{
        Comments.find(req.query)
            .populate('author')
            .then(comments=>{
                if(comments != null){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(comments);
                }
                else{
                    err = new Error('No Comments to display !');
                    err.status = 404;
                    return next(err);
                }
            },err=>next(err))
            .catch(err=>next(err))
    })
    .post(corsWithOptions,verifyUser,(req,res,next)=>{
        if(req.body !== null){
          req.body.author = req.user._id;
          Comments.create(req.body)
          .then((comment) => {
              Comments.findById(comment._id)
              .populate('author')
              .then((comment) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(comment);
              })
          }, (err) => next(err))
          .catch((err) => next(err));
        }
        else{
          err = new Error('Comment not found in request body');
          err.status = 404;
          return next(err);
        }
    })
    .put(corsWithOptions,verifyUser,verifyAdmin,(req,res,next)=>{
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes/'
            + req.params.dishId + '/comments');
    })
    .delete(corsWithOptions,verifyUser,verifyAdmin,(req,res,next)=>{
        Comments.remove({})
            .then(resp=>{
               res.statusCode = 200;
               res.setHeader('Content-Type', 'application/json');
               res.json(resp);
            },(err) => next(err))
            .catch((err) => next(err));    
    })

// "/dishes/:dishId/comments/:commentId routes"
router.route('/:commentId')
.options(corsWithOptions,(req,res)=>{ res.sendStatus(200)})
    .get(cors,(req,res,next)=>{
        Comments.findById(req.params.commentId)
            .populate('author')
            .then(comment=>{
                if(comment != null){
                    res.statusCode = 200
                    res.setHeader('Content-Type','application/json')
                    res.json(comment)
                }
                else{
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            },err=>{
                next(err)
            })
            .catch(err=> next(err))
    })
    .post(corsWithOptions,verifyUser,(req,res,next)=>{
        res.statusCode = 403;
        res.end('Post operation not supported on /comments/'+req.params.commentId);
    })
    .put(corsWithOptions,verifyUser,(req,res,next)=>{
        Comments.findById(req.params.commentId)
            .then(comment=>{
                if(comment != null){
                    if(req.user._id.equals(comment.author)){
                         Comments.findByIdAndUpdate(req.params.commentId,{
                              $set:req.body
                         },{new:true})
                         .then(comment=>{
                              res.statusCode = 200
                              res.setHeader('Content-Type','application/json')
                              res.json(comment)
                         },err=>next(err))
                    } 
                    else{
                        var err= new Error('You are not authorized to update this comment')
                        err.status = 403
                        next(err)
                    }  
                }
                else{
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            },err=>{
                next(err)
            })
            .catch(err=>next(err))
    })
    .delete(corsWithOptions,verifyUser,(req,res,next)=>{
     Comments.findById(req.params.commentId)
     .then(comment=>{
         if(comment != null){
             if(req.user._id.equals(comment.author)){
                  Comments.findByIdAndRemove(req.params.commentId)
                  .then(comment=>{
                       res.statusCode = 200
                       res.setHeader('Content-Type','application/json')
                       res.json(comment)
                  },err=>next(err))
             } 
             else{
                 var err= new Error('You are not authorized to update this comment')
                 err.status = 403
                 next(err)
             }  
         }
         else{
             err = new Error('Comment ' + req.params.commentId + ' not found');
             err.status = 404;
             return next(err);
         }
     },err=>{
         next(err)
     })
     .catch(err=>next(err))
    })

module.exports = router
