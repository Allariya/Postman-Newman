# Postman-Newman
Some things I use every day that might be helpful to others.

**Postman Test Automation**

Postman contains a runtime based om node.js. 
Javascript code can be added to execute during  2 events in the flow:
* before a request (Pre-request Script tab)
* after a request (Test tab)

Here you can find descriptions of:

* [Pre-request scripts](#pre-request-scripts)
* [Chai assertions lib](https://www.chaijs.com/api/bdd/)
* [moment.js  cheat sheet](https://momentjs.com/docs/#/displaying/format/)
* [lodash.js cheat sheet](https://github.com/Allariya/Postman-Newman/blob/master/Lodash_cheatshit.js)
* [Cheerio](https://github.com/cheeriojs/cheerio/blob/master/Readme.md)
* [Dynamic variables](https://learning.postman.com/docs/postman/variables-and-environments/variables-list/)
* [Other Modules available](https://learning.postman.com/docs/postman/scripts/postman-sandbox-api-reference/)
* [Some Test scripts](#some-test-scripts)
* [Logs](#logs)
* [Newman](https://www.npmjs.com/package/newman)
* [Workflow example using setNextRequest()](https://github.com/Allariya/Postman-Newman/blob/master/workflow_example.postman_collection.json)

# pre-request-scripts

I use them to generate fake data for tests.
For example, sending random alphanumeric string the the URL parameters.

```javascript
function myFunction(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_ ';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   pm.environment.set("myVariable", result);
   return result;
 }
console.log('TEST NAME GENERATED: ' + myFunction(120));

//does almost the same but with Lodash:
var randomChars = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
var newDirName = _.pad(randomChars, 120, '-_ !#@$%^&*(;:){}[]<>+,.=?/^`|~');
pm.environment.set("dirName", newDirName);
```

There are a lot of built-in modules in postman which can be used for pre-request scripts: [moment.js](#moment.js), [lodash.js]((https://github.com/Allariya/Postman-Newman/blob/master/Lodash_cheatshit.js)). Here are some simple examples:

```javascript
var moment = require('moment');
// Creating a variable to use as the start date in a particular format
pm.globals.set("startDate", moment().format("DD/MM/YYYY"));

// Creating a variable to use as the end date and using the .add() function to set it 30 days in the future
pm.globals.set("endDate", moment().add(30,'days').format("DD/MM/YYYY"));

// Creating a variable with the .random() function to set a new number in the 500 > 5000 range
pm.globals.set("favoriteNumber", _.random(500, 5000));

// Using the .shuffle() function to change the order of an array
let favoriteColours = ['Blue', 'Red', 'Yellow', 'Orange', 'Green'];

pm.globals.set("favoriteColours", _.shuffle(favoriteColours));

// Using the .shuffle() function to change the order of an array and set the variable to the first one using .first()
pm.globals.set("todaysFavoriteColour", _.first(_.shuffle(favoriteColours)));

// Using the _.uniq() function to create a new array within the replicated values
let uniqueAnimals = ["Dog", "Cat", "Dog", "Cow", "Dog", "Lion", "Dog", "Horse"];

pm.globals.set("uniqueAnimals", _.uniq(uniqueAnimals));

//using random dynamic variables in pre-request scripts
pm.variables.replaceIn('{{$randomFirstName}}')
````


# some-test-scripts

Getting information from a response header (a token, usually):

```javascript
//getting a token and passing it to an environmental variable
pm.environment.set("sessionToken", postman.getResponseHeader("WWW-Authenticate"))

//or
pm.environment.set("sessionToken", pm.response.headers.get("WWW-Authenticate"));

//parsing the request
//this works for form-data:
var reqBody = request.data;
//this works for raw:
var reqBody = JSON.parse(request.data);

//Parsing the response:

```javascript
var jsonBody = pm.response.json();

//to check that there were no error messages, and displaying the error message if there's any. (pm.expect - underlying this is the ChaiJS expect BDD library).
pm.test("NO ERRORS", () => {
    pm.expect(jsonBody.messages).to.eql(null);
    });
    if (jsonBody.messages !== null) {
        console.log(jsonBody.message);
}
``` 
pm.expect() takes an additional argument to add custom messages to the assertion:

```javascript 
//Check that the response body is not empty 
pm.test("The response body is not empty", () => {
pm.expect(pm.response.json(), "The response body is empty").to.not.be.empty;
});
```  

.to.have.keys():

```javascript 
//Testing that the response is an object and has the correct keys
pm.test("The response should be an object", () => {
    pm.expect(jsonData).to.be.an('object').to.have.keys('results', 'info');
});

//Testing that the objects in the array have the correct keys
pm.test("The object should have the correct keys", () => {
    jsonData.results.forEach(result => {
        pm.expect(result).to.have.keys('name', 'location', 'gender', 'dob', 'phone');
    });
});

//If we need to check the same for the object, not for the array, we use _.each (Lodash)
pm.test("contacts have correct keys", () => {
    _.each(jsonData.Contacts, (contact => {
        pm.expect(contact).to.have.keys('name', 'jobtitle', 'companyName');
    }));
});
```

Searching for an element in an array:

```javascript
//response:
{
"users": [
{'user': 'barney', 'active': false, 'id': 1},
{ 'user': 'fred',    'active': false, , 'id': 2},
{ 'user': 'pebbles', 'active': true, , 'id': 3}
],
}
//let's say we need to find a user barney and save his id to a variable.

var jsonBody = pm.response.json();//parsing response
//js find():
const userIndex = jsonBody.users.find((inf) => inf.user === 'barney'); // searching for the element's index
pm.environment.set('userID', userIndex.id);

//lodash _.findIndex():
var userIndex = _.findIndex(jsonBody.users, {"user": "barney"});
pm.environment.set('userID', jsonBody.users[userIndex].id);

```
Searching for data in HTML response using Cheerio:

```javascript
const $ = cheerio.load(pm.response.text())

pm.test("it should return a title", () => { 
    pm.expect($('title').text()).to.not.be.empty 
})

pm.environment.set('title', $('title').text())


const $ = cheerio.load(pm.response.text());
var summary = pm.environment.get('summary');//If an environment variable is called inside the function, postman runner doesn't execute pm.invironment.get, so call it outside and use a local variable.
pm.test("Rendered HTML is correct", () => { 
    pm.expect($('h1').text()).to.eql(summary);
});



```

Taking data from one part of the response and using it to assert against another value using pm.expect:

```javascript
pm.test("MESSAGE THAT WILL BE SHOWN IN THE CONSOLE", function(){
    const expectedResult = pm.environment.get('expectedVar'); 
    //Variable 'expectedVar' should be stored beforehand manually or from one other request.
    pm.expect(jsonBody.<yourPath>).to.eql(expectedVar);//you can also use .to.not.eql(), .to.include(), .to.not.include() and many others that Postman provides.
});

//forEach(), replace()
const jsonData = pm.response.json();
pm.test("The email address should contain correct name", () => {
    jsonData.results.forEach(result => {
//set the values of the first and the last names as local variables 
        let firstName = result.name.first;
        let lastName = result.name.last;
//Check that the email address contains the full name
//Using .replace() to remove the whitespace in the name
        pm.expect(result.email).to.equal(`${firstName.replace(" ", "")}.${lastName.replace(" ", "")}@domain.com);
});
});

// Using oneOf() to show that an assertion can be one of many things
pm.test("The gender value should be `male` or `female`", () => {
    jsonData.results.forEach(result => {
        pm.expect(result.gender).to.be.oneOf(['male', 'female']);
    });
});

// Check that the date format is correct using .match()
        pm.expect(result.dob.date).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
```
# logs

Useful pre-request scripts for logs:

```javascript
// Indentify where the the log statement has been run
console.log(`${pm.info.eventName} - This is executed in the Pre-Request Script before the request is sent`);

// Logging out the name of the request being run
console.log(`Request Name: ${pm.info.requestName}`);
```

Scripts that make Logs more convenient to use:

```javascript
// Logging details of the request out to the console
console.log(`${pm.info.eventName} - This is executed in the Tests Script after the request is sent`);

// Parsing all the response data and saving that to a variable 
const jsonData = pm.response.json();

// Using console.log() to confirm the data being returned before creating your assertions 
pm.test("All the objects have the correct keys", () => {
    _.each(jsonData.results, (result) => {
        console.log(_.keys(result));
        //pm.expect(result).to.have.keys('gender', 'name', 'dob')
    });
});

// Using console.log() to confirm the value that we want to check has the correct datatype
pm.test("All the properties have the correct data type", () => {
    _.each(jsonData.results, (result) => {
        console.log(`${typeof result.name.first} - ${result.name.first}`);
        // pm.expect(result.name.first).to.be.a('string')
    });
});

// Logging out the cookie information
console.log(pm.cookies);
```
