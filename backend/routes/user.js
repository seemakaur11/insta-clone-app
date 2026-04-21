const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const POST = mongoose.model("POST");
const requireLogin = require("../middlewares/requireLogin")

// to get user profile
router.get("/user/:id", async (req, res) => {
    
    try {
        const user = await USER.findOne({ _id: req.params.id })
            .select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const post = await POST.find({ postedBy: req.params.id })
            .populate("postedBy", "_id");

        res.status(200).json({ user, post });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

//to follow user


router.put("/follow", requireLogin, async (req, res) => {
    try {
        // add follower to other user
        await USER.findByIdAndUpdate(
            req.body.followId,
            {
                $addToSet: { followers: req.user._id } // prevent duplicates
            },
            { new: true }
        );

        // add following to current user
        const result = await USER.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: { following: req.body.followId }
            },
            { new: true }
        );

        res.json(result);

    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});
// to unFollow user
router.put("/unfollow", requireLogin, async (req, res) => {
    try {
        // remove follower from other user
        await USER.findByIdAndUpdate(
            req.body.followId,
            {
                $pull: { followers: req.user._id }
            },
            { new: true }
        );

        // remove following from current user
        const result = await USER.findByIdAndUpdate(
            req.user._id,
            {
                $pull: { following: req.body.followId }
            },
            { new: true }
        );

        res.json(result);

    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});

//to upload profile pic
router.put("/uploadProfilePic", requireLogin, async (req, res) => {
    try {
        const result = await USER.findByIdAndUpdate(
            req.user._id,
            {
                $set: { Photo: req.body.pic }
            },
            { new: true }
        );

        res.json(result);

    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});

module.exports = router