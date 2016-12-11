var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

// this is our model and 
//  all todos is our collection
var todos = [{
	id: 1,
	description: 'MEET mof for lunch',
	completed: false
},{
	id: 2,
	description: 'Go to market',
	completed: false
},{
	id: 3,
	description: 'Go for walk',
	completed: true
}];

app.get('/',function (req, res) {
	res.send('Todo Api Root');
});

app.get('/todos',function (req, res) {
	res.json(todos);
});

app.get('/todos/:id',function (req, res) {

	var todoId = parseInt(req.params.id);
	var matcheTodo;

	todos.forEach ( function(todo) {
		if (todo.id === todoId) {
			matcheTodo = todo;
		} 
	});

	if(matcheTodo) {
		res.json(matcheTodo);
	} else{
		res.status(404).send();
	}
	//res.send(req.params.id);
});

app.listen(PORT, function() {
	console.log('Express listening on port '+ PORT +'!');
});