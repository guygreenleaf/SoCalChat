const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        Username: {
            type: String,
            require: true,
            min: 4,
            max: 20,
            unique: true
        },
        Email: {
            type: String,
            required: true,
            min: 8,
            max: 50,
            unique: true
        },
        Password: {
            type: String,
            required: true,
            min: 8,
        },
        ProfilePicture: {
            type: String,
            default: ""
        },
        CoverPicture: {
            type: String,
            default: ""
        },
        Friends: {
            type: Array,
            default: []
        },
        SentFriendRequests: {
            type: Array,
            default: []
        },
        ReceivedFriendRequests: {
            type: Array,
            default: []
        },
        IsAdmin: {
            type: Boolean,
            default: false
        },
    },   
        {timestamps: true}
);

module.exports = mongoose.model("User", UserSchema);
