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
      contract.AddPrize("OneBitcoin", {from:bob});
      contract.AddPrize("TwoEthereum", {from:bob});
      return contract.prizes(1).then ( prize => { assert.equal(prize, "TwoEthereum", "Bob should be able to add prizes") }); 
  });

  it("will list names and prizes", function() {
      contract.NbUsers.call().then( nbUsers => { console.log("NbUsers:"+ nbUsers) });
      console.log("User,prize,drawn,accepted");
      contract.users.call(0).then( user => { console.log("- User[0]:"+ user) });
      contract.users.call(1).then( user => { console.log("- User[1]:"+ user) });
      contract.users.call(2).then( user => { console.log("- User[2]:"+ user) });
      contract.NbPrizes.call().then( nbPrizes => { console.log("NbPrizes:"+ nbPrizes) });
      contract.prizes.call(0).then( prize => { console.log("- Prize[0]:"+ prize) });
      return contract.prizes.call(1).then( prize => { console.log("- Prize[1]:"+ prize) });
  });

  it("will test random number as an event", function() {
      contract.TestRandom().then( tx => {
  
          var event = contract.TestRandomEvent({fromBlock: 0, toBlock: 'latest'});
          event.watch(function(error, result){
              if (!error)
                  var r = result[0];
                  console.log(result.args.random.valueOf());
                  console.log(result.args.returnValue);
                  event.stopWatching();
          });
      }); 
  });

  // it("will draw winner and price, redraw again for another name, and accept prize ", function() {
  //     return contract.Draw().then( tx => {
  //         return contract.Draw.call().then( winner => { console.log("--> Winner(indexU,indexP,user,price) : "+ winner); 
  //             return contract.ReDrawUser(winner[0],winner[1]).then( tx => {
  //                 return contract.ReDrawUser.call(winner[0],winner[1]).then( newwinner => { console.log("--> New winner instead:"+ newwinner);
  //                     return contract.AcceptDraw(newwinner[0],winner[1]).then( tx => {
  //                         return contract.NbPrizes.call().then( nbPrizes => { 
  //                             console.log("NbPrize left:"+ nbPrizes);
  //                             contract.users.call(newwinner[0]).then( user => { console.log("- Check winner :"+ user) });
  //                             contract.users.call(0).then( user => { console.log("- User[0] :"+ user) });
  //                             contract.users.call(1).then( user => { console.log("- User[1] :"+ user) });
  //                             return contract.users.call(2).then( user => { console.log("- User[2] :"+ user) }); 

  //                         });
  //                     });
  //                 });
  //             });
  //         });
  //     });
  // });



  // it("will draw price and winner ", function() {
  //     return contract.Draw.call().then( winner => { console.log("--> Winner (index+desc) : "+ winner) });
  // });

  // it("will redraw Anne for the prize of One Bitcoin", function() {
  //     return contract.ReDrawUser.call(0,0).then( winner => { console.log("--> New winner instead of Anne[0]:"+ winner) });
  // });


  // it("will accept winner (Anne) and price (OneBitcoin)", function() {
  //     return contract.AcceptDraw(0,0).then( tx => {
  //         contract.users.call(0).then( user => { console.log("- User[0]:"+ user) });
  //         return contract.NbPrizes.call().then( nbPrizes => { console.log("NbPrizes:"+ nbPrizes) });
  //     });
  // });

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
