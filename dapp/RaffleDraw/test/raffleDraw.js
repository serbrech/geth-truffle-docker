//const Web3 = require('web3')
var RaffleDraw = artifacts.require("./RaffleDraw.sol");

contract('RaffleDraw', function(accounts) {

  // Deploy the app and put the returning object in var contract
  var contract;
  RaffleDraw.deployed().then(function(instance) {
      contract = instance;
  });

  var bob = accounts[0];
  var alice = accounts[1];

  it("will return the deployment contract vars", function() {
      //console.log(contract);    <-- display all var of the contract
      sender=contract.constructor.class_defaults.from;
      balance_sender = web3.fromWei(web3.eth.getBalance(sender).toNumber(),'ether');
      console.log("Sender/owner: addr=" + sender + " -> balance=" + balance_sender);

      balance = web3.fromWei(web3.eth.getBalance(contract.address).toNumber(),'ether'); 
      console.log("Contract: addr=" + contract.address + " -> balance=" + balance);
      //console.log("ABI:");
      //console.log(contract.abi);
  });

  it("will return the in-app vars", function() {
      contract.gameName().then( gameName => { console.log("Game name: " + gameName) });
      contract.admins(0).then( admin => { console.log("Admin[0] : " + admin) });
      contract.nbAdmins().then( nbAdmins => { console.log("Nb of admins by default: " + nbAdmins) });
      return contract.gameName();
  });

  it("will check if owner(bob) is admin by default", function() {
      return contract.IsAdmin.call(bob).then( bool => { assert.equal(bool, true, "Bob(owner) should be admin") });
  });

  it("will check if alice is not admin by default", function() {
      return contract.IsAdmin.call(alice).then( bool => { assert.equal(bool, false, "Alice should not be admin") }); 
  });

  it("will check alice(not admin) can't add user ", function() {
       contract.AddUser("Vince", {from:alice});  
       contract.users(0).then ( error => { console.log("error? " +error) }); 
//assert.equal(error, , "Alice should not be able to add user")
  });

  it("will check Bob(admin) can add user ", function() {
      contract.AddUser("Fred", {from:bob});  
      contract.users(0).then ( user => { assert.equal(user, "Fred", "Bob should be able to add user") }); 

  });

/*
  it("will check bob (admin and owner) can add 2 users", function() {
      contract.AddUser("Bob");  
      contract.AddUser("Alice");
      contract.users(0).then ( user => { console.log("User[0] is: " + user) }); 
      contract.users(1).then ( user => { console.log("User[1] is: " + user) });     
      return contract.gameName();
  });

  it("will add prizes of 1 Ethereum and 1 Satoshi", function() {
      contract.AddPrize("1 Ethereum");
      contract.AddPrize("1 Statoshi");
      contract.prizes(0).then ( prize => { console.log("Prize[0] is: " + prize) });
      contract.prizes(1).then ( prize => { console.log("Prize[1] is: " + prize) });
      return contract.gameName();
  });

  it("will test random number", function() {
      return contract.testRandom.call().then( randomNum => { console.log("A random number is [0 to 4] :" + randomNum) }); 
  });

  it("will list prizes", function() {
      return contract.nbPrizes().then ( nbPrizes => { 
          console.log("Number of prizes :" + nbPrizes);
          var nb = nbPrizes;
          console.log ("Prices list:");
          for (var i = 0; i < nb; i++) {
              contract.prizes(i).then( prize => { console.log(prize) });
          };
          return contract.gameName();  // Why to I need return to displayed in right order??
      });
  });

  it("will list admins", function() {
      return contract.nbAdmins().then ( nbAdmins => { 
          console.log("Number of Admins :" + nbAdmins);
          var nb = nbAdmins;
          console.log ("Admins list:");
          for (var i = 0; i < nb; i++) {
              contract.admins(i).then( admin => { console.log(admin) });
          };
          return contract.gameName();
      });
  });
*/


});