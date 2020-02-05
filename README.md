# Postman-Newman
Some things I use every day that might be helpful to others

**Postman Test Scripts**

Postman uses JavaScript, and it's very handy when you need to pass a variable between the requests or to see some specila results of the run in the console. That's really vital for Newman.

**SIMPLE TESTS TO MAKE SURE THAT EVERYTHING IS OK**

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

//shows that there's no error messages in response. Needed when you get 200OK from server AND an error message (yes, this happens)
console.log("key used: " + data.appkey);
var jsonBody = JSON.parse(responseBody);
pm.test("NO ERRORS", function(){
pm.expect(jsonBody.messages).to.eql(null);
});
if (jsonBody.messages !== null) {
console.log(jsonBody.message);//Shows an error message (if any) in the console. This may not work for you if the response has a different structure, update the path.
}
```    
**GET THE TOKEN FOR FURTHER REQUEST**
```javascript
//paring a response header with a token and passing it to an environmental variable
pm.environment.set("sessionToken", postman.getResponseHeader("WWW-Authenticate"))
``` 
 **SEARCHING FOR A SPECIAL ELEMENT IN AN ARRAY TO STORE IT IN A VARIABLE**
```javascript
var jsonBody = JSON.parse(responseBody);
const varName = jsonBody.content.find((inf) => inf.name === 'elementName'); // searching for the element's index
pm.environment.set("envVarName", varName.uid); //variable 'varName' here is the path to the element to be stored. Use the name of the element that you are searching for instead of 'uid'
```
**COMPARING THE ACTUAL RESULT IN RESPONSE WITH THE EXPECTED**
```javascript
var jsonBody = JSON.parse(responseBody);
pm.test("MESSAGE THAT WILL BE SHOWN IN THE CONSOLE", function(){
    const expectedResult = pm.environment.get('expectedVar'); 
    //Varialbe 'expectedVar' should be stored beforehand manually or from one other request.
    pm.expect(jsonBody.yourPath).to.eql(expectedVar);//you can also use .to.not.eql(), .to.include(), .to.not.include() and many others that Postman provides.
});
```

**PRE-REQUEST SCRIPTS**
I use them to generate file names, nicknames, emails and so on.
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
