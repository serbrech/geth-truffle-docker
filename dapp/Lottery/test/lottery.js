var Lottery = artifacts.require("./Lottery.sol");

contract('Lottery', function(accounts) {

  // Deploy the app and put the returning object in var contract
  var contract;
  Lottery.deployed().then(function(instance) {
      contract = instance;
  });

  // Test where we just display vars
  it("will return all the deployment contract vars", function() {
      //console.log(contract);    <-- display all var of the contract
      sender=contract.constructor.class_defaults.from;
      console.log("Sender address: " + sender);
      console.log("Contract address: " + contract.address);
      //console.log("ABI:");
      //console.log(contract.abi);
      balance = web3.eth.getBalance(contract.address).toNumber();  
      console.log("Balance: " + balance)    
  });

  // We need to call function to see the function vars (public only are accessible)
  it("will return the in-app vars", function() {
      contract.gameName().then(function(gameName) {
        console.log("Game name: " + gameName);
      });
      contract.totalBets().then(function(totalBets) {
        console.log("Totalbets: " + totalBets);   
      });
  });

  it("will test var with doing 1 bet", function() {

      contract.Bet().then(function(tx) {
          contract.totalBets().then(function(totalBets) {
              console.log("Totalbets: " + totalBets);   
          });
        
      });
  });



});
