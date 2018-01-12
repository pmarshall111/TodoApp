//requiring express, then activating it as a function and storing in app
var express = require("express"),
	app = express(),
	port = 8080,
	bodyParser = require("body-parser")

//requiring our routes which are used for GET and POST etc requests.
var todoRoutes = require("./routes/todos")

//these 2 lines allow us to easily acces the request body that comes in a post request. uses body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//__dirname is used here so that no matter where we start our server from, the server will always know where to find these 2
//folders. This is because the directory name will end with todo app... nodepractice/todoapp  ...  /app.js
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public/js"));
app.use(express.static(__dirname + "/public/css"));


//standard route just for the homepage. will correspond to localhost:8080/
app.get("/", function(req,res) {
	res.sendFile("index.html")
})

//using the routes with a the string appended before the route. i.e. a get("/") would actually refer to get("/api/todos/")
app.use("/api/todos", todoRoutes)

//starting up the server and specifying which port to listen on
app.listen(port, function() {
	console.log("app is go")
})