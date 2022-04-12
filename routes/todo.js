const express = require('express');
const auth = require('../middleware/user_jwt');
const Todo = require('../models/Todo');

const router = express.Router();

//desc : create new todo task
//method: Post
router.post('/',auth,async(req,res,next) => {
    try {
        const toDo = await Todo.create({title:req.body.title, description: req.body.description, user: req.user.id});
        if(!toDo){
            return res.status(400).json({
                success:false,
                msg:"Something went wrong"
            });
        }

        res.status(200).json({
            success:true,
            todo:toDo,
            msg:"Successfully Created"
        });
     } catch (error) {
        next(error);
    }
});



//desc : fetch all todos
//method : get
router.get('/',auth,async(req,res,next) => {
    try {
        const todo = await Todo.find({
            user: req.user.id, 
            finished:false
        });

        if(!todo){
            return res.status(400).json({
                success:false,
                msg:"Something went wrong"
            });
        }

        res.status(200).json({
            success:true,
            count : todo.length,
            todos : todo,
            msg:"Successfully Fetched"
        });

    } catch (error) {
        next(error);
    }
});


//desc : update a task
//method : put
router.put('/:id',async(req,res,next)=>{
    try {
        let toDo = await Todo.findById(req.params.id);
        if(!toDo)
        {
            return res.status(400).json({
                success: false,
                msg: "Task Todo not Exist"
            });
        }

        toDo = await Todo.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true
        });

        res.status(200).json({
            success: true,
            todo: toDo,
            msg: "Sucessfully Updated"
        });
    } catch (error) {
        next(error);
    }
});




//desc : delete a task
//method : delete
router.delete('/:id',async(req,res,next) => {
    try {
        let toDo = await Todo.findById(req.params.id);
        if(!toDo)
        {
            return res.status(400).json({
                success: false,
                msg: "Task Todo not Exist"
            });
        }

        toDo = await Todo.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            msg: "Sucessfully Deleted"
        });
    } catch (error) {
        next(error);
    }
});


//desc : fetch finished todos
//method : get
router.get('/',auth,async(req,res,next) => {
    try {
        const todo = await Todo.find({
            user: req.user.id, 
            finished:true
        });

        if(!todo){
            return res.status(400).json({
                success:false,
                msg:"Something went wrong"
            });
        }

        res.status(200).json({
            success:true,
            count : todo.length,
            todos : todo,
            msg:"Successfully Fetched"
        });

    } catch (error) {
        next(error);
    }
});



module.exports = router;