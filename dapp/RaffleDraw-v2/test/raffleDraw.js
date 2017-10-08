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
      contract.AddUser("Carl", {from:bob});
      //contract.AddUser("Dom", {from:bob});  
      return contract.users(2).then ( name => { assert.equal(name[0], "Carl", "Bob should be able to add users") }); 
  });

  it("will check Bob(admin) can add prizes", function() {
      contract.AddPrize("1 Bitcoin", {from:bob});
      contract.AddPrize("2 Ethereum", {from:bob});
      return contract.prizes(1).then ( prize => { assert.equal(prize, "2 Ethereum", "Bob should be able to add prizes") }); 
  });

  it("will list names and prizes", function() {
      contract.NbUsers.call().then( nbUsers => { console.log("NbUsers:"+ nbUsers); 
      contract.users.call(0).then( user => { console.log("- User[0]:"+ user) });
      contract.users.call(1).then( user => { console.log("- User[1]:"+ user) });
      contract.users.call(2).then( user => { console.log("- User[2]:"+ user) });
      contract.NbPrizes.call().then( nbPrizes => { console.log("NbPrizes:"+ nbPrizes) });
      contract.prizes.call(0).then( prize => { console.log("- Prize[0]:"+ prize) });
      return contract.prizes.call(1).then( prize => { console.log("- Prize[1]:"+ prize) });

      });

  });
});



// contract('RaffleDraw::draw', function(accounts) {
  
//   it("will draw a name + price", function() {
//       RaffleDraw.deployed()
//           .then( instance => { instance.AddUser("Anne", {from:bob});  return instance; })
//           .then( instance => { instance.AddUser("Bart", {from:bob});  return instance; })



      // return contract.Draw().then( tx => { ;
      //     return contract.Draw.call().then( draw => { console.log("IndexU[" + draw[0] + "],P[" + draw[1] + "] => winner: " + draw[2] + " => prize: " + draw[3]);
      //         console.log("IndexU: " + draw[0].valueOf());
      //         return contract.users.call(draw[0]).then( user => { console.log("After draw: indexU[" + draw[0] + "] = " + user) });
      //     });
      // });
   //});




  // it("will accept prize[0] for user[0], so only 1 prize left", function() {
  //     contract.users.call(0).then( (user) => { console.log("Before accept: user[0]= " + user) });
  //     contract.AcceptDraw(0,0);
  //     contract.users.call(0).then( (user) => { console.log("After accept: user[0]: " + user) });
  //     return contract.NbPrizes.call().then( nbPrizes => { console.log("NbPrize:"+ nbPrizes) });
  //  });



// });


// how to remove use from string or mapping?
