_.random()

	//Return random number between 0 and 1000
	_.random(1000)

	//Return random number between 15 and 20
	_.random(15, 20)

	//Return random floating point number between 0 and 200
	_.random(200, true)

_.chain() 

/*function to group multiple Lodash functions, in order to filter down the response data, to log out a specific area that is causing us a problem. we start it with the _.chain() function and close it out with the .value() function. The part in the middle is doing the leg work and each one is changing the data, as it passes through, leaving us with the value(s) that we want to display.*/

	let colors = _.chain(pm.response.json())
		.map('favorite_colors')
		.flatten()
		.uniq()
		.value()

/*using the .map() function to get all the values from the ‘favourite_colour‘ property and placing those into separate arrays, then I’m using the .flatten() function to flatten the arrays into a single array. Finally, I’m using the _.uniq() function to filter the flattened array, to only return unique ‘favourite_colour’ values.*/

_.times()

	// 1. Basic for loop.
	for(var i = 0; i < 5; i++) {
		// ....
	}

	// 2. Using Array's join and split methods
	Array.apply(null, Array(5)).forEach(function(){
		// ...
	});

	// Lodash - self-explanatory
	_.times(5, function(){
		// ...
	});
_______________________________________________________

	// Create an array of length 6 and populate them with unique values. The value must be prefix with "ball_".
	// eg. [ball_0, ball_1, ball_2, ball_3, ball_4, ball_5]

	// Array's map method.
	Array.apply(null, Array(6)).map(function(item, index){
		return "ball_" + index;
	});


	// Lodash
	_.times(6, _.uniqueId.bind(null, 'ball_'));
	
_.map()

	// Fetch the name of the first pet from each owner
	var ownerArr = [{
		"owner": "Colin",
		"pets": [{"name":"dog1"}, {"name": "dog2"}]
	}, {
		"owner": "John",
		"pets": [{"name":"dog3"}, {"name": "dog4"}]
	}];

	// Array's map method.
	ownerArr.map(function(owner){
	   return owner.pets[0].name;
	});

	// Lodash
	_.map(ownerArr, 'pets[0].name');
	
_.pick
	var objA = {"name": "colin", "car": "suzuki", "age": 17};
	var objB = _.pick(objA, ['car', 'age']);
	// {"car": "suzuki", "age": 17}

_.sample

	var luckyDraw = ["Colin", "John", "James", "Lily", "Mary"];
	_.sample(luckyDraw); // Colin
	_.sample(luckyDraw, 2); // ['John','Lily']
	
_.assign

	var foo = { a: "a property" };
	var bar = { b: 4, c: "an other property" }

	var result = _.assign({ a: "an old property" }, foo, bar);
	// result => { a: 'a property', b: 4, c: 'an other property' }
	
_.find

	var users = [
	  { firstName: "John", lastName: "Doe", age: 28, gender: "male" },
	  { firstName: "Jane", lastName: "Doe", age: 5, gender: "female" },
	  { firstName: "Jim", lastName: "Carrey", age: 54, gender: "male" },
	  { firstName: "Kate", lastName: "Winslet", age: 40, gender: "female" }
	];

	var user = _.find(users, { lastName: "Doe", gender: "male" });
	// user -> { firstName: "John", lastName: "Doe", age: 28, gender: "male" }

	var underAgeUser = _.find(users, function(user) {
		return user.age < 18;
	});
	// underAgeUser -> { firstName: "Jane", lastName: "Doe", age: 5, gender: "female" }
	
_.keyBy

/*It helps a lot when trying to get an object with a specific property. Let’s say we have 100 blog posts and we want to get the post with Id “34abc”*/

	var posts = [
		{ id: "1abc", title: "First blog post", content: "..." },
		{ id: "2abc", title: "Second blog post", content: "..." },
		// more blog posts
		{ id: "34abc", title: "The blog post we want", content: "..." }
		// even more blog posts
	];

	posts = _.keyBy(posts, "id");

	var post = posts["34abc"]
	// post -> { id: "34abc", title: "The blog post we want", content: "..." }