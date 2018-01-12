let mongoose = require("mongoose")

//creating schema. Schema are just the rules of the entry
let todoSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	created_date: {
		type: Date,
		default: Date.now
	},
	order: {
		type: Number,
		default: Math.random
	}
})

//models are constructors that are made from the schema
let Todo = mongoose.model("Todo", todoSchema)

module.exports = Todo