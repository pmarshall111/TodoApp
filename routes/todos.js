//empress.Router() allows us to create routing shortcuts. i.e. get("/") would be the end of the shortcut we give in app.js when we call the exports in the use funciton
let express = require("express");
let router = express.Router();
//models folder is where mongoose interacts with mongoDB, hence why it's called db... database
let db = require("../models");
let helpers = require("../helpers/todos")


//using router.route which can help us shorten our code and put all the requests for the same route together
router.route("/")
	.get(helpers.getTodos)
	.post(helpers.createTodo)


router.route("/:todoId")
	.get(helpers.getSingleTodo)
	.put(helpers.updateTodo)
	.delete(helpers.deleteTodo)



//making sure we export so other files can use this one
module.exports = router