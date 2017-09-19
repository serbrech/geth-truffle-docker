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

  it("will check Bob(admin) can add prizes", function() {
      contract.AddPrize("1 Bitcoin", {from:bob});
      contract.AddPrize("2 Ethereum", {from:bob});
      //contract.AddUser("Carl", {from:bob});
      //contract.AddUser("Dom", {from:bob});  
      contract.prizes(1).then ( user => { assert.equal(user, "2 Ethereum", "Bob should be able to add prizes") }); 
  });

  it("will list users and prizes", function() {
      contract.NbUsers.call().then( nbUsers => { console.log("NbUsers:"+ nbUsers) });
      contract.users.call(0).then( user => { console.log("- User[0]:"+ user) });
      contract.users.call(1).then( user => { console.log("- User[1]:"+ user) });
      contract.NbPrizes.call().then( nbPrizes => { console.log("NbPrize:"+ nbPrizes) });
      contract.prizes.call(0).then( prize => { console.log("- Prize[0]:"+ prize) });
      return contract.prizes.call(1).then( prize => { console.log("- Prize[1]:"+ prize) });
  });

  // it("will remove user Anne", function() {
  //     contract.RemoveUser(0);
  //     contract.users.call(0).then( user => { console.log("User[0]:"+ user) });
  //     return contract.NbUsers.call().then( nbUsers => { console.log("NbUsers:"+ nbUsers) });
  // });

  it("will test random number", function() {
      return contract.TestRandom.call().then( random => { console.log("A random number is [0 to 1] :" + random) }); 
  });

  it("will draw a winner and check only 1 user left", function() {
      contract.DrawUser(); // WHY CAN'T I JUST GET IN RETURN THE USER?
      contract.DrawUser.call().then( user => { console.log("=> winner: " + user) });  
      contract.NbUsers.call().then( nbUsers => { console.log("NbUsers remaining:"+ nbUsers) });
      return contract.NbUsers.call().then( nbUsers => { assert.equal(nbUsers, 1, "Only 1 user should remains") }); 
      // HOW TO DO AN assert.contains(...)?
      //return contract.users.call(1).catch ( error => { assert.contains(error.message, "Error: VM Exception while executing eth_call: invalid opcode", "The winning user should be deleted") }); 
      //return contract.users.call(1).catch ( error => { console.log(error.message) }); 
  });

  it("will draw a prize and check only 1 prize left", function() {
      contract.DrawPrize();
      contract.DrawPrize.call().then( prize => { console.log("=> prize: " + prize) });  
      contract.NbPrizes.call().then( nbPrizes => { console.log("NbPrizes remaining:"+ nbPrizes) });
      return contract.NbPrizes.call().then( nbPrizes => { assert.equal(nbPrizes, 1, "Only 1 prize should remains") }); 
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



});


// how to remove use from string or mapping?
// how to list a whole string / mapping without loop?
// how to delete a string name, without knowing the index ?