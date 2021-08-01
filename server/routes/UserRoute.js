const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const authToken = require("../middleware/JWTAuth");

//Update user
router.put("/:id", authToken.authenticateToken, async(req, res) => {
    if(req.body.UserId == req.params.id || req.body.IsAdmin){
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);

            } catch (error) {
                return res.status(500).json(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated");

        } catch (error) {
            
        }
    } else{
        return res.status(403).json("You can only update your own account!");
    }
});

//Delete user
router.put("/:id/delete", authToken.authenticateToken, async(req, res) => {
    if(req.body.UserId == req.params.id || req.body.IsAdmin){
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
            
        } catch (error) {
            
        }
    } else{
        return res.status(403).json("You can only delete your own account!");
    }
});

//Get user 
router.get("/:id", authToken.authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {Password, updatedAt, __v, Email, SentFriendRequests, ReceivedFriendRequests, ...other} = user._doc
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Send user friend request
router.put("/:id/SendRequest", authToken.authenticateToken, async (req, res) => {
    try {
        if(req.body.UserId !== req.params.id){
            try {
                const user = await User.findById(req.params.id);
                const currentUser = await User.findById(req.body.UserId);
                if(!user.SentFriendRequests.includes(req.body.UserId) && !user.ReceivedFriendRequests.includes(req.body.UserId) && !currentUser.SentFriendRequests.includes(req.params.id) && !currentUser.ReceivedFriendRequests.includes(req.params.id) && !user.Friends.includes(req.body.UserId)){
                    await user.updateOne({ $push: { ReceivedFriendRequests: req.body.UserId } });
                    await currentUser.updateOne({ $push: { SentFriendRequests: req.params.id } });
                    res.status(200).json(`Sent friend request from ${currentUser.Username} to ${user.Username}`);

                } else{
                    res.status(403).json("You already requested this user, they sent you a request, or you are already friends with this user.")
                }
            } catch (error) {
                res.status(500).json(error);
            }

        } else{
            res.status(403).json("You cannot add yourself as a friend.");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})


//Accept or deny friend request
router.put("/:id/RespondToRequest/:response", authToken.authenticateToken, async (req, res) => {
    try {
        if(req.body.UserId !== req.params.id){
            try {
                const user = await User.findById(req.params.id);
                const currentUser = await User.findById(req.body.UserId);
                if(currentUser.ReceivedFriendRequests.includes(req.params.id) && user.SentFriendRequests.includes(req.body.UserId)){
                    if(req.params.response === 'accept'){
                        await user.updateOne({ $push: { Friends: req.body.UserId } });
                        await currentUser.updateOne({ $push: { Friends: req.params.id } });

                        await currentUser.updateOne({ $pull: { ReceivedFriendRequests: req.params.id } });
                        await user.updateOne({ $pull: { SentFriendRequests: req.body.UserId } });
                        res.status(200).json(`Accepted friend request from ${user.Username}.`);
                    }
                    else if (req.params.response === 'deny'){
                        await currentUser.updateOne({ $pull: { ReceivedFriendRequests: req.params.id } });
                        await user.updateOne({ $pull: { SentFriendRequests: req.body.UserId } });
                        res.status(200).json(`Denied friend request from ${user.Username}.`);
                    }
                    else{
                        res.status(503).json("Neither accept or deny was chosen as a response.")
                    }
                    

                } else{
                    res.status(403).json("You have not been sent a friend request from this user OR they still need to respond to your request.")
                }
            } catch (error) {
                res.status(500).json(error);
            }

        } else{
            res.status(403).json("You cannot add yourself as a friend!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

//Remove user from friends list 
router.put("/:id/RemoveFromFriends", authToken.authenticateToken, async (req, res) => {
    try {
        if(req.body.UserId !== req.params.id){
            try {
                const user = await User.findById(req.params.id);
                const currentUser = await User.findById(req.body.UserId);
                if(currentUser.Friends.includes(req.params.id) && user.Friends.includes(req.body.UserId)){
                    await currentUser.updateOne({ $pull: { Friends: req.params.id } });
                    await user.updateOne({ $pull: { Friends: req.body.UserId } });
                    res.status(200).json(`Removed ${user.Username} from ${currentUser.Username}'s friends list.`);
                } else{
                    res.status(403).json("You are not friends with this user.");
                }
            } catch (error) {
                res.status(500).json(error);
            }

        } else{
            res.status(403).json("You could never have yourself as a friend, so this operation is impossible!!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router