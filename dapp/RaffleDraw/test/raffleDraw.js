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
      return contract.gameName().then( gameName => { console.log("Game name: " + gameName) });
  });

  it("will check alice(not admin) can't add users ", function() {
       contract.AddUser("Vince", {from:alice}).catch ( error => { assert.equal(error.message, "VM Exception while processing transaction: invalid opcode", "Alice should not be able to add users") }); 
  });

  it("will check Bob(admin) can add users", function() {
      contract.AddUser("Anne", {from:bob});
      contract.AddUser("Bart", {from:bob});
      //contract.AddUser("Carl", {from:bob});
      //contract.AddUser("Dom", {from:bob});  
      contract.users(1).then ( user => { assert.equal(user, "Bart", "Bob should be able to add users") }); 
  });

  it("will check alice(not admin) can't add prizes", function() {
       contract.AddPrize("1 Ethereum", {from:alice}).catch ( error => { assert.equal(error.message, "VM Exception while processing transaction: invalid opcode", "Alice should not be able to add prices") }); 
  });

  it("will check Bob(admin) can add prizes", function() {
      contract.AddPrize("1 Bitcoin", {from:bob});
      contract.AddPrize("2 Ethereum", {from:bob});
      contract.AddPrize("3 Dash", {from:bob});
      contract.AddPrize("4 OmiseGo", {from:bob});  
      contract.prizes(3).then ( user => { assert.equal(user, "4 OmiseGo", "Bob should be able to add prizes") }); 
  });

  // it("will test random number", function() {
  //     return contract.testRandom.call().then( randomNum => { console.log("A random number is [0 to 4] :" + randomNum) }); 
  // });

  it("will draw a winner", function() {
      return contract.DrawUser.call().then( user => { console.log(" => Winner: " + user) }); 
  });

  it("will draw another winner", function() {
      return contract.DrawUser.call().then( user => { console.log(" => 2nd Winner: " + user) }); 
  });




  // it("will list prizes", function() {
  //     return contract.nbPrizes().then ( nbPrizes => { 
  //         console.log("Number of prizes :" + nbPrizes);
  //         var nb = nbPrizes;
  //         for (var i = 0; i < nb; i++) {
  //             contract.prizes(i).then( prize => { console.log(prize) });
  //         };
  //         return contract.gameName();  // Why to I need return to displayed in right order??
  //     });
  // });

  // it("will list users", function() {
  //     return contract.nbUsers().then ( nbUsers => { 
  //         console.log("Number of Users :" + nbUsers);
  //         var nb = nbUsers;
  //         for (var i = 0; i < nb; i++) {
  //             contract.users(i).then( user => { console.log(user) });
  //         };
  //         return contract.gameName();
  //     });
  // });



});