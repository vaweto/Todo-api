var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;

// this is our model and 
//  all todos is our collection
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/',function (req, res) {
	res.send('Todo Api Root');
});

app.get('/todos',function (req, res) {
	res.json(todos);
});


//Get todo by id
app.get('/todos/:id',function (req, res) {

	var todoId = parseInt(req.params.id);
	var matcheTodo = _.findWhere(todos, {id: todoId});
	// var matcheTodo;

	// todos.forEach ( function(todo) {
	// 	if (todo.id === todoId) {
	// 		matcheTodo = todo;
	// 	} 
	// });

	if(matcheTodo) {
		res.json(matcheTodo);
	} else{
		res.status(404).send();
	}
	//res.send(req.params.id);
});

//Post a new todo
app.post('/todos', function(req, res) {
	
	var body = _.pick(req.body, 'description', 'completed');

	if ( !_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ) {
		
		return res.status(400).send();

	} else {

		body.description = body.description.trim();

		body.id = todoNextId++;

		todos.push(body);

		res.json(body);
	}
 
});

app.listen(PORT, function() {
	console.log('Express listening on port '+ PORT +'!');
});