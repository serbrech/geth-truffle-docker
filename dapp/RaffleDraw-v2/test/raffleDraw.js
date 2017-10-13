//const Web3 = require('web3')
var RaffleDraw = artifacts.require("./RaffleDraw.sol");

// contract('RaffleDraw: reject actions', function(accounts) {
//   var bob = accounts[0];
//   var alice = accounts[1];

//   it("will check alice(not admin) can't add users", function(done) {
//       RaffleDraw.deployed()
//           .then( instance => { instance.AddUser("Anne", {from:alice})
//               .catch ( error => { assert.equal(error.message, "VM Exception while processing transaction: invalid opcode", "Alice should not be able to add users") })
//               done();
//           });
//   });

//   it("will check bob can't draw if no user registered", function(done) {
//       RaffleDraw.deployed()
//           .then( instance => { instance.Draw({from:bob})
//               .catch ( error => { assert.equal(error.message, "VM Exception while processing transaction: invalid opcode", "Alice should not be able to add users") })
//               done();
//           });
//   });

// });


// contract('RaffleDraw: simple checks', function(accounts) {
//   var bob = accounts[0];
//   var alice = accounts[1];

//   it("will check bob(admin) can add users", function(done) {
//       RaffleDraw.deployed()
//           .then( instance => { instance.AddUser("Anne", {from:bob}); return instance; })
//           .then( instance => { instance.AddUser("Bart", {from:bob}); return instance; })
//           .then( instance => { instance.AddUser("Carl", {from:bob}); return instance; })
//           .then( instance => { instance.AddUser("Dom", {from:bob}); return instance; })
//           .then( instance => { return instance.users(3); })
//           .then( user => {
//               assert.equal(user[0], "Dom", "Bob should be able to add users");
//               done();
//           });
//   });

//   it("will check bob(admin) can add prizes", function(done) {
//       RaffleDraw.deployed()
//           .then( instance => { instance.AddPrize("OneBitcoin", {from:bob}); return instance; })
//           .then( instance => { instance.AddPrize("TwoEthereum", {from:bob}); return instance; })
//           .then( instance => { return instance.prizes(1); })
//           .then( prize => {
//               assert.equal(prize, "TwoEthereum", "Bob should be able to add prizes");
//               done();
//           });
//   });

//   it("will test that user not drawn can't be swapped via ReDrawUser function", function(done) {
//       RaffleDraw.deployed()
//           .then( instance => { instance.ReDrawUser(0,0)
//               .catch ( error => { assert.equal(error.message, "VM Exception while processing transaction: invalid opcode", "User not drawn can't be swapped via ReDrawUser function") })
//                done();
//            });
          
//   });

//   it("will draw a winner&price and check that RedrawUser can't be called for a prize not drawn for the first user", function(done) {
//       RaffleDraw.deployed()
//           .then( instance => { instance.Draw() ; return instance; })
//           .then( instance => {
//               var event = instance.DrawEvent({fromBlock: 0, toBlock: 'latest'});
//               event.watch(function(error, result){
//                   if (!error)
//                   var indexU = result.args.randomU;
//                   var indexP = result.args.randomP;
//                   console.log("DrawEvent => (indexU, indexP, winner, prize) => " + indexU + "," + indexP + "," + result.args.winner + "," + result.args.prize);
//                   event.stopWatching();
                  
//                   // Now we will ReDraw this resulting drawn user, but not with his price
//                   instance.AddPrize("FakeEOS"); // should be index prize of 2

//                   instance.ReDrawUser(indexU,2) // we force ReDraw winner, with fakeEOS prizes
//                       .catch ( error => { assert.equal(error.message, "VM Exception while processing transaction: invalid opcode", "RedrawUser can't be called for a prize not drawn for the first user") })
//                       done();
//               });
//           });
//   });


// });



contract('RaffleDraw: full raffle workflow', function(accounts) {
  var bob = accounts[0];
  var alice = accounts[1];

  it("will draw winner&price, redraw again for another winner, and accept winner&prize ", function(done) {
      RaffleDraw.deployed()
          .then( instance => { instance.AddUser("Anne", {from:bob}); return instance; })
          .then( instance => { instance.AddUser("Bart", {from:bob}); return instance; })
          .then( instance => { instance.AddUser("Carl", {from:bob}); return instance; })
          .then( instance => { instance.AddUser("Dom", {from:bob}); return instance; })
          .then( instance => { instance.AddPrize("OneBitcoin", {from:bob}); return instance; })
          .then( instance => { instance.AddPrize("TwoEthereum", {from:bob}); return instance; })
          .then( instance => { instance.Draw() ; return instance; })
          .then( instance => {
              var event = instance.DrawEvent({fromBlock: 0, toBlock: 'latest'});
              event.watch(function(error, result){
                  if (!error)
                  var indexU = result.args.randomU;
                  var indexP = result.args.randomP;
                  console.log("DrawEvent => (indexU, indexP, winner, prize) => " + indexU + "," + indexP + "," + result.args.winner + "," + result.args.prize);
                  event.stopWatching();

                  instance.ReDrawUser(indexU,indexP)
                  .then ( tx => {
                      var event2 = instance.ReDrawUserEvent({fromBlock: 0, toBlock: 'latest'});
                      event2.watch(function(error, result2){
                          if (!error)
                          var newIndexU = result2.args.newRandomU;
                          console.log("ReDrawUserEvent => (newIndexU, newWinner) => " + newIndexU + "," + result2.args.newWinner );
                          event2.stopWatching();

                          instance.AcceptDraw(newIndexU,indexP)
                          .then( tx => {
                              var event3 = instance.AcceptDrawEvent({fromBlock: 0, toBlock: 'latest'});
                              event3.watch(function(error, result3){
                                  if (!error)
                                  console.log("AcceptDrawEvent => (finalWinner, prize) => " + result3.args.winner + "," + result3.args.prize );
                                  event3.stopWatching();
                                  done();
                              });
                          });
                      });
                  });
              });
          });
  });


});



//-------------------------------------------------------------------------------------------
// Simple test of a value:
    // instance.Test1.call(indexU, indexP)
    // .then( value => {
    //     console.log(value);
                         
    // });      


  // var contract_;
  // RaffleDraw.deployed().then(function(instance) {
  //     contract_ = instance;
  // });

  // // Deploy the app and put the returning object in var contract
  // var contract;
  // RaffleDraw.deployed().then(function(instance) {
  //     contract = instance;
  // });

  // it("will check Bob(admin) can add users", function() {
  //     contract.AddUser("Anne", {from:bob}); 
  //     contract.AddUser("Bart", {from:bob});
  //     contract.AddUser("Carl", {from:bob});
  //     //contract.AddUser("Dom", {from:bob});  
  //     return contract.users(2).then ( name => { assert.equal(name[0], "Carl", "Bob should be able to add users") }); 
  // });

  // it("will check Bob(admin) can add prizes", function() {
  //     contract.AddPrize("OneBitcoin", {from:bob});
  //     contract.AddPrize("TwoEthereum", {from:bob});
  //     return contract.prizes(1).then ( prize => { assert.equal(prize, "TwoEthereum", "Bob should be able to add prizes") }); 
  // });

  // it("will list names and prizes", function() {
  //     contract.NbUsers.call().then( nbUsers => { console.log("NbUsers:"+ nbUsers) });
  //     console.log("User,prize,drawn,accepted");
  //     contract.users.call(0).then( user => { console.log("- User[0]:"+ user) });
  //     contract.users.call(1).then( user => { console.log("- User[1]:"+ user) });
  //     contract.users.call(2).then( user => { console.log("- User[2]:"+ user) });
  //     contract.NbPrizes.call().then( nbPrizes => { console.log("NbPrizes:"+ nbPrizes) });
  //     contract.prizes.call(0).then( prize => { console.log("- Prize[0]:"+ prize) });
  //     return contract.prizes.call(1).then( prize => { console.log("- Prize[1]:"+ prize) });
  // });

  // it("will draw winner&price, redraw again for another winner, and accept winner&prize ", function() {
  //     contract.Draw().then( tx => {

  //         var event = contract.DrawEvent({fromBlock: 0, toBlock: 'latest'});
  //         event.watch(function(error, result){
  //             if (!error)
  //             var indexU = result.args.randomU;
  //             var indexP = result.args.randomP;
  //             console.log("DrawEvent => (indexU, indexP, winner, prize) => " + indexU + "," + indexP + "," + result.args.winner + "," + result.args.prize);
  //             event.stopWatching();
              
  //             contract.ReDrawUser(indexU,indexP).then( tx => {

  //                 var event2 = contract.ReDrawUserEvent({fromBlock: 0, toBlock: 'latest'});
  //                 event2.watch(function(error, result2){
  //                     if (!error)
  //                     var newIndexU = result2.args.newRandomU;
  //                     console.log("ReDrawUserEvent => (newIndexU, newWinner) => " + newIndexU + "," + result2.args.newWinner );
  //                     event2.stopWatching();
                      
  //                     contract.AcceptDraw(newIndexU,indexP).then( tx => {
  //                         var event3 = contract.AcceptDrawEvent({fromBlock: 0, toBlock: 'latest'});
  //                         event3.watch(function(error, result3){
  //                             if (!error)
  //                             console.log("AcceptDrawEvent => (finalWinner, prize) => " + result3.args.winner + "," + result3.args.prize );
  //                             event3.stopWatching();
  //                         });
  //                     });

  //                 });
  //             });

  //         });
  //     });
  // });






//----------------------
  // it("will redraw winner", function() {
  //     contract.ReDrawUser(0,0).then( tx => {

  //         var event = contract.ReDrawUserEvent({fromBlock: 0, toBlock: 'latest'});
  //         event.watch(function(error, result2){
  //             if (!error)
  //             console.log("ReDrawUserEvent: " + result2.args.newRandomU + "," + result2.args.newWinner );
  //             event.stopWatching();
  //         });
  //     });
  // });


  // it("will test random number as an event", function() {
  //     contract.TestRandom().then( tx => {
  
  //         var event = contract.TestRandomEvent({fromBlock: 0, toBlock: 'latest'});
  //         event.watch(function(error, result){
  //             if (!error)
  //                 console.log(result.args.random.valueOf());
  //                 console.log(result.args.returnValue);
  //                 event.stopWatching();
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
