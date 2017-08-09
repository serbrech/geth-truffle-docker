var Lottery = artifacts.require("./Lottery.sol");

contract('Lottery', function(accounts) {

  owner = accounts[0]
  var contract;
      Lottery.deployed().then(function(instance) {
          contract = instance;
      });

  it("gets all the contract vars", function() {
      //return contract.then(function(contract) {
          
          //console.log(contract);    <-- display all var of the contract
          sender=contract.constructor.class_defaults.from;
          console.log("Sender address: " + sender);
          console.log("Contract address: " + contract.address);
          console.log("ABI:");
          console.log(contract.abi);
      //});
  });

  it("Var: game_name", function() {

      contract.totalBets().then(function(gameName) {
        console.log("Game name: " + gameName);
      });
      contract.gameName().then(function(totalBets) {
        console.log("totalbets: " + totalBets);   
      });
  });


  // it("Var: totalBets", function() {
  //     return Lottery.deployed().then(function(contract) {
          
  //     });
  // });



});
