var Greeter = artifacts.require("./Greeter.sol");

contract('Greeter', function(accounts) {

  it("should check the default greeter value is set in the contract", function() {
	Greeter.deployed()
		.then( instance => { return instance.Greet(); })
    	.then( value => { 
      		assert.equal(value, "I am Groot!", "There should be a correct value");
 		});
  });

  it("should set a new greeter value, then check that value is returned", function() {
	Greeter.deployed()
		.then( instance => { instance.SetGreet("Hello Geneva!"); return instance; })
		.then( instance => { return instance.Greet(); })
    	.then( result => { 
      		assert.equal(result, "Hello Geneva!", "There should be a correct value");
 		});
  });

});
