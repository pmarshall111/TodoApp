//putting an extra dot at the start if we need to move back another folder
const db = require("../models")

exports.getTodos = function(req,res){
	//these functions are mongoose functions that help us interact with our database. Find is left empty so we find all todos
	db.Todo.find()
	.then(function(todos) {
		res.json(todos)
	})
	.catch(function(err) {
		res.send(err)
	})
}


exports.createTodo = function(req, res) {
	db.Todo.create(req.body)
	.then(function(newTodo) {
		res.status(201).json(newTodo)
	})
	.catch(function(err) {
		console.log(err)
	})
}



exports.getSingleTodo = function(req,res) {
	let id = req.params.todoId;
	db.Todo.findById(id)
	.then(function(foundTodo) {
		res.json(foundTodo)
	}).catch(function(err) {
		console.log(err)
	})
}


//not using a findById method, so we have to use an object as first argument with what we're searching for
//the second argument is then what we want to update (using body-parser here to get the info from the request)
//third argument is to make sure we return the updated todo back to the user
exports.updateTodo = function(req, res) {
	let id = req.params.todoId;
	let changes = req.body
	// changes["created_date"] = Date.now();
	db.Todo.findOneAndUpdate({_id: id}, req.body, {new: true})
	.then(function(updatedTodo) {
		res.json(updatedTodo)
	}).catch(function(err) {
		console.log(err)
	})
}



//defining request to delete todo. also included is another mongoose request to show all entries in the database.
//doesn't need another router request because all that does is tell the server to do something. we have already told our server to do something with the router.delete
exports.deleteTodo = function(req, res) {
	db.Todo.remove({_id: req.params.todoId})
	.then(function() {
		return db.Todo.find()
	})
	.then(function(todos) {
		let obj = {
			message: "Delete successful!",
			todos
		}
		res.json(obj)
	})
	.catch(function(error) {
		console.log("outer", error)
	})
}

//making sure we export all our functions which we previously put into the exports object
module.exports = exports