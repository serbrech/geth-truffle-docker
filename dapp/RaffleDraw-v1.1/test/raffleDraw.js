//const Web3 = require('web3')
var RaffleDraw = artifacts.require("./RaffleDraw.sol");


// GOT AN ISSUE RUNNING ALL TESTS IN ONCE: ERROR WITH 
// - The tx doesn't have the correct nonce
// - Or Not enought gas

contract('RaffleDraw: reject actions', function(accounts) {
  var bob = accounts[0];
  var alice = accounts[1];

  it("will check alice(not admin) can't add users", function(done) {
      RaffleDraw.deployed()
          .then( instance => { instance.AddUser("Anne", {from:alice})
              .catch ( error => { assert.equal(error.message, "VM Exception while processing transaction: invalid opcode", "Alice should not be able to add users") })
              done();
          });
  });

  it("will check bob can't draw if no user registered", function(done) {
      RaffleDraw.deployed()
          .then( instance => { instance.Draw({from:bob})
              .catch ( error => { assert.equal(error.message, "VM Exception while processing transaction: invalid opcode", "Alice should not be able to add users") })
              done();
          });
  });

});


contract('RaffleDraw: simple checks', function(accounts) {
  var bob = accounts[0];
  var alice = accounts[1];

  it("will check bob(admin) can add users", function(done) {
      RaffleDraw.deployed()
          .then( instance => { instance.AddUser("Anne", {from:bob}); return instance; })
          .then( instance => { instance.AddUser("Bart", {from:bob}); return instance; })
          .then( instance => { instance.AddUser("Carl", {from:bob}); return instance; })
          .then( instance => { instance.AddUser("Dom", {from:bob}); return instance; })
          .then( instance => { return instance.users(3); })
          .then( user => {
              assert.equal(user[0], "Dom", "Bob should be able to add users");
              done();
          });
  });

  it("will check bob(admin) can add prizes", function(done) {
      RaffleDraw.deployed()
          .then( instance => { instance.AddPrize("OneBitcoin", {from:bob}); return instance; })
          .then( instance => { instance.AddPrize("TwoEthereum", {from:bob}); return instance; })
          .then( instance => { return instance.prizes(1); })
          .then( prize => {
              assert.equal(prize, "TwoEthereum", "Bob should be able to add prizes");
              done();
          });
  });

  it("will test that user not drawn can't be swapped via ReDrawUser function", function(done) {
      RaffleDraw.deployed()
          .then( instance => { instance.ReDrawUser(0,0)
              .catch ( error => { assert.equal(error.message, "VM Exception while processing transaction: invalid opcode", "User not drawn can't be swapped via ReDrawUser function") })
               done();
           });
  });

  it("will draw a winner&price and check that RedrawUser can't be called for a prize not drawn for the first user", function(done) {
      RaffleDraw.deployed()
          .then( instance => { instance.Draw() ; return instance; })
          .then( instance => {
              var event = instance.DrawEvent({fromBlock: 0, toBlock: 'latest'});
              event.watch(function(error, result){
                  if (!error)
                  var indexU = result.args.randomU;
                  var indexP = result.args.randomP;
                  console.log("DrawEvent => (indexU, indexP, winner, prize) => " + indexU + "," + indexP + "," + result.args.winner + "," + result.args.prize);
                  event.stopWatching();
                  
                  // Now we will ReDraw this resulting drawn user, but not with his price
                  instance.AddPrize("FakeEOS"); // should be index prize of 2

                  instance.ReDrawUser(indexU,2) // we force ReDraw winner, with fakeEOS prizes
                      .catch ( error => { assert.equal(error.message, "VM Exception while processing transaction: invalid opcode", "RedrawUser can't be called for a prize not drawn for the first user") })
                      done();
              });
          });
  });

});



// contract('RaffleDraw: full raffle workflow', function(accounts) {
//   var bob = accounts[0];
//   var alice = accounts[1];
  
//   balance_sender = web3.fromWei(web3.eth.getBalance(bob).toNumber(),'ether');
//   console.log("Account0: addr=" + bob + " -> balance=" + balance_sender);

//   balance = web3.fromWei(web3.eth.getBalance(alice).toNumber(),'ether'); 
//   console.log("Account1: addr=" + alice + " -> balance=" + balance);

//   it("will draw winner&price, redraw again for another winner, and accept winner&prize ", function(done) {
//       RaffleDraw.deployed()
//           .then( instance => { instance.AddUser("Anne", {from:bob}); return instance; })
//           .then( instance => { instance.AddUser("Bart", {from:bob}); return instance; })
//           .then( instance => { instance.AddUser("Carl", {from:bob}); return instance; })
//           .then( instance => { instance.AddUser("Dom", {from:bob}); return instance; })
//           .then( instance => { instance.AddPrize("OneBitcoin", {from:bob}); return instance; })
//           .then( instance => { instance.AddPrize("TwoEthereum", {from:bob}); return instance; })
//           .then( instance => { instance.Draw() ; return instance; })
//           .then( instance => {
//               var event = instance.DrawEvent({fromBlock: 0, toBlock: 'latest'});
//               event.watch(function(error, result){
//                   if (!error)
//                   var indexU = result.args.randomU;
//                   var indexP = result.args.randomP;
//                   console.log("DrawEvent => (indexU, indexP, winner, prize) => " + indexU + "," + indexP + "," + result.args.winner + "," + result.args.prize);
//                   event.stopWatching();

//                   instance.ReDrawUser(indexU,indexP)
//                   .then ( tx => {
//                       var event2 = instance.ReDrawUserEvent({fromBlock: 0, toBlock: 'latest'});
//                       event2.watch(function(error, result2){
//                           if (!error)
//                           var newIndexU = result2.args.newRandomU;
//                           console.log("ReDrawUserEvent => (newIndexU, newWinner) => " + newIndexU + "," + result2.args.newWinner );
//                           event2.stopWatching();

//                           instance.AcceptDraw(newIndexU,indexP)
//                           .then( tx => {
//                               var event3 = instance.AcceptDrawEvent({fromBlock: 0, toBlock: 'latest'});
//                               event3.watch(function(error, result3){
//                                   if (!error)
//                                   console.log("AcceptDrawEvent => (finalWinner, prize) => " + result3.args.winner + "," + result3.args.prize );
//                                   event3.stopWatching();
//                                   done();
//                               });
//                           });
//                       });
//                   });
//               });
//           });
//   });

// });






// NOT USED -------------------------------------------------------------------------------------------
// Simple test of a value:
    // instance.Test1.call(indexU, indexP)
    // .then( value => {
    //     console.log(value);
                         
    // });      

