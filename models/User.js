import {model, Schema} from "mongoose";

const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},

    personalization: {
        about: {type: String},
        gender: {type: String},
        interests: [{type: String}],
        images: [{type: String}]
    },

    liked: [{type: String}],
    disliked: [{type: String}]

})




export default model("User", User)