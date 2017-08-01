var Counter = artifacts.require("./Counter.sol");

contract('Counter', function(accounts) {
  it("Defaut counter should be 0", function() {
    return Counter.deployed().then(function(instance) {
      return instance.getCount();
    }).then(function(value) {
      assert.equal(value, "0", "Defaut counter should be 0");
    });
  });
  it("One increment from 0 should be 1", function() {
    return Counter.deployed().then(function(instance) {
      instance.increment();
      return instance.getCount();
    }).then(function(value) {
      assert.equal(value, "1", "One increment from 0 should be 1");
    });
  });
});
