const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST")
const requireLogin = require("../middlewares/requireLogin")

//Route
router.get("/allposts",requireLogin,(req,res)=>{
    POST.find()
    .populate("postedBy","_id name Photo")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(posts =>res.json(posts))
    .catch(err => console.log("allpost error",err))
})

router.post("/createPost", requireLogin, (req,res)=>{

    const {body,pic} = req.body;

    if(!body || !pic){
        return res.status(422).json({error:"Please add all the fields"})
    }
    console.log("req user",req.user)
   const post =  new POST({
        body,
        photo:pic,
        postedBy:req.user
   })
   post.save().then((result)=>{
        return res.json({post:result})
   }).catch(err => console.log(err))
})

router.get("/myposts", requireLogin, (req, res) => {
    POST.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")
        .then(myposts => {
            res.json(myposts)
        })
})

router.put("/like",requireLogin, (req,res)=>{
    POST.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user.id}
    },{
        new:true
    }).populate("postedBy", "_id name Photo")
    .then(result=>{
        res.json(result);
    })
    .catch(err => {
        return res.status(422).json({ error: err.message });
    });

})

router.put("/unlike",requireLogin, (req,res)=>{
    POST.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user.id}
    },{
        new:true
    }).populate("postedBy", "_id name Photo")
    .then(result=>{
        res.json(result);
    })
    .catch(err => {
        return res.status(422).json({ error: err.message });
    });

})

router.put("/comment", requireLogin, async (req, res) => {
    try {
        const comment = {
            comment: req.body.text,
            postedBy: req.user._id
        };

        const result = await POST.findByIdAndUpdate(
            req.body.postId,
            {
                $push: { comments: comment }
            },
            {
                new: true
            }
        )
        .populate("comments.postedBy", "_id name Photo")
        .populate("postedBy", "_id name Photo");

        res.json(result);

    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});

//Api to delete post
// router.delete("/deletePost/:postId", requireLogin, async (req, res) => {
//     console.log(req.params.postId)
//     try {
//         const post = await POST.findOne({ _id: req.params.postId })
//             .populate("postedBy", "_id");

//         if (!post) {
//             return res.status(422).json({ error: "Post not found" });
//         }

//         // check ownership
//         if (post.postedBy._id.toString() === req.user._id.toString()) {

//             await POST.findByIdAndDelete(req.params.postId);

//             return res.json({ message: "Successfully deleted" });
//         } else {
//             return res.status(403).json({ error: "Unauthorized" });
//         }

//     } catch (err) {
//         return res.status(500).json({ error: err.message });
//     }
// });

router.delete("/deletePost/:postId", requireLogin, async (req, res) => {
    try {
        const post = await POST.findById(req.params.postId);

        if (!post) {
            return res.status(422).json({ error: "Post not found" });
        }

        // 🔥 SAFE CHECK
        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await post.deleteOne();

        res.json({ message: "Successfully deleted" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// to show following post
router.get("/myfollwingpost", requireLogin, (req, res) => {
    POST.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json(posts)
        })
        .catch(err => { console.log(err) })
})

module.exports = router