# Postman-Newman
Some things I use every day that might be helpful to others

**Postman Test Scripts**

Postman uses JavaScript, and it's very handy when you need to pass a variable between the requests or to see some specila results of the run in the console. That's really vital for Newman.

**SIMPLE TESTS TO MAKE SURE THAT EVERYTHING IS OK**

There are a lot snippets in Postman, but sometimes I find this one useful when I get an error message and don't care what the status code is.
```javascript
//parsing the response. Parsing all the response data and saving that to a variable: pm.response.json().data;
var jsonBody = pm.response.json();

pm.test("NO ERRORS", () => {
    pm.expect(jsonBody.messages).to.eql(null);
    });
    if (jsonBody.messages !== null) {
        console.log(jsonBody.message);//Shows an error message (if any) in the console. This may not work for you if the response has a different structure, update the path.
}
``` 
By the way the pm.expect() function takes an additional argument to add custom messages to the assertion:

```javascript 
//Check that the response body is not empty 
pm.test("The response body is not empty", () => {
pm.expect(pm.response.json(), "The response body is empty").to.not.be.empty;
});
```  
```javascript 
//Testing that the response is an object and has the correct keys
pm.test("The response should be an object", () => {
    pm.expect(jsonData).to.be.an('object').to.have.keys('results', 'info');
});
```
```javascript 
//Testing that the objects in the array have the correct keys
pm.test("The object should have the correct keys", () => {
    jsonData.results.forEach(result => {
        pm.expect(result).to.have.keys('name', 'location', 'gender', 'dob', 'phone');
    });
});
```
If we need to check the same for the object, not for the array, we use _.each (Lodash)

```javascript
pm.test("contacts have correct keys", () => {
    _.each(jsonData.Contacts, (contact => {
        pm.expect(contact).to.have.keys('name', 'jobtitle', 'companyName');
    }));
});
```

**GET THE TOKEN FOR FURTHER REQUESTS (FROM HEADER)**
```javascript
//paring a response header with a token and passing it to an environmental variable
pm.environment.set("sessionToken", postman.getResponseHeader("WWW-Authenticate"))
``` 
 **SEARCHING FOR A SPECIAL ELEMENT IN AN ARRAY TO STORE IT IN A VARIABLE**
```javascript
const jsonBody = pm.response.json();
const varName = jsonBody.content.find((inf) => inf.name === 'elementName'); // searching for the element's index
pm.environment.set("envVarName", varName.uid); //variable 'varName' here is the path to the element to be stored. Use the name of the element that you are searching for instead of 'uid'

//or use lodash _.findIndex()
var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];
 
_.findIndex(users, function(o) { return o.user == 'barney'; });
// => 0
 
// The `_.matches` iteratee shorthand.
_.findIndex(users, { 'user': 'fred', 'active': false });
// => 1
 
// The `_.matchesProperty` iteratee shorthand.
_.findIndex(users, ['active', false]);
// => 0
 
// The `_.property` iteratee shorthand.
_.findIndex(users, 'active');
// => 2

//find index and use as a part of a locator
var efs = _.findIndex(jsonBody.content, {"name": "efs.efs"});
pm.environment.set('testFile', jsonBody.content[efs].uid);
```
**COMPARING THE ACTUAL RESULT IN RESPONSE WITH THE EXPECTED**
```javascript
const jsonBody = pm.response.json();
pm.test("MESSAGE THAT WILL BE SHOWN IN THE CONSOLE", function(){
    const expectedResult = pm.environment.get('expectedVar'); 
    //Variable 'expectedVar' should be stored beforehand manually or from one other request.
    pm.expect(jsonBody.yourPath).to.eql(expectedVar);//you can also use .to.not.eql(), .to.include(), .to.not.include() and many others that Postman provides.
});
```
```javascript 
const jsonData = pm.response.json();
//Taking data from one part of the response and using it to assert against another value
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
```
```javascript
// Using oneOf to show that an assertion can be one of many things
pm.test("The gender value should be `male` or `female`", () => {
    jsonData.results.forEach(result => {
        pm.expect(result.gender).to.be.oneOf(['male', 'female']);
    });
});
```
```javascript
 // Check that the date format is correct using .match()
        pm.expect(result.dob.date).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
```

**PRE-REQUEST SCRIPTS**
I use them to generate fake data for tests.
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

//almost the same but with Lodash
var randomChars = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
var newDirName = _.pad(randomChars, 87, '-_ !@#$%^&*(){}[]<>');
pm.environment.set("dirName", newDirName);
```
There are a lot of built-in modules in postman which can be used for pre-request scripts.
Just use require() 

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
````

**LOGS**
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

