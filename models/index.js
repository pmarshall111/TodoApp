let mongoose = require("mongoose")

//mongoose connecting to database. the final part of the path will be created if the named entry does not exist
mongoose.connect("mongodb://localhost/todo-api")

//setting mongoose.Promise = Promise so that we can use promises with our data
mongoose.Promise = Promise;

//exporting the mongoose.models part. models are basically constructors that are made from our schemas
module.exports.Todo = require("./todo")