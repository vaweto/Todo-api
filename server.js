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
	var queryParams = req.query;
	var filteredTodos = todos;

	//check if url has parameter and make the filter with where
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos,{completed:true});
	} else if( queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos,{completed:false});
	}


	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0 ){
		filteredTodos = .filter(filteredTodos,function(todo){
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		})
	}

	res.json(filteredTodos);
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


//Delete /todos/:id
app.delete('/todos/:id', function(req, res){

	var todoId = parseInt(req.params.id,10);
	var matcheTodo = _.findWhere(todos, {id: todoId});

	if(!matcheTodo){
		res.status(404).json({"error":"no to do find with that id"});
	}else{
		todos = _.without(todos,matcheTodo);
		res.json(matcheTodo);
	}
	
});

//Put /todos/:id
app.put('/todos/:id',function(req, res){
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	var todoId = parseInt(req.params.id,10);
	var matcheTodo = _.findWhere(todos, {id:todoId});

	if(!matcheTodo){
		return res.status(404).json({"error":"no to do find with that id"});
	}

	//validation
	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed) ){
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed') ) {
		return res.status(400).send();
	} else {
		//never provided attribute, no problem
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0 ) {
		validAttributes.description = body.description; 
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	} else {

	}

	_.extend(matcheTodo, validAttributes);
	res.json(matcheTodo);

});

app.listen(PORT, function() {
	console.log('Express listening on port '+ PORT +'!');
});