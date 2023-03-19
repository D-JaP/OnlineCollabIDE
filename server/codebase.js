
const { Schema, model } = require("mongoose")


const codebase = new Schema ({
    _id: String,
    title: String,
    created: Date,
    last_update: Date,
    data: {
        html: String, 
        css: String,
        js: String
    }
})

module.exports  = model("codebase",codebase)