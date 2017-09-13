//const Web3 = require('web3')
var Lottery = artifacts.require("./Lottery.sol");

contract('Lottery', function(accounts) {

  // Deploy the app and put the returning object in var contract
  var contract;
  Lottery.deployed().then(function(instance) {
      contract = instance;
  });

  var bob = accounts[0];
  var alice = accounts[1];

  // Test where we just display vars
  it("will return all the deployment contract vars", function() {
      //console.log(contract);    <-- display all var of the contract
      sender=contract.constructor.class_defaults.from;
      balance_sender = web3.fromWei(web3.eth.getBalance(sender).toNumber(),'ether');
      console.log("Sender/owner: addr=" + sender + " -> balance=" + balance_sender);

      balance = web3.fromWei(web3.eth.getBalance(contract.address).toNumber(),'ether'); 
      console.log("Contract: addr=" + contract.address + " -> balance=" + balance);
      //console.log("ABI:");
      //console.log(contract.abi);
  });

  it("will return all geth/testrpc vars", function() {
      balance_bob = web3.fromWei(web3.eth.getBalance(bob).toNumber(),'ether');
      balance_alice = web3.fromWei(web3.eth.getBalance(alice).toNumber(),'ether'); 
      console.log("bob: addr=" + bob + " -> balance=" + balance_bob);
      console.log("alice: addr=" + alice + " -> balance=" + balance_alice);
  });

  // We need to call function to see the function vars (public only are accessible)
  it("will return the in-app vars", function() {
      contract.gameName().then( gameName => {
          console.log("Game name: " + gameName);
      });
      contract.totalBets().then( totalBets => {
          console.log("Totalbets: " + totalBets);   
      });
  });

  it("will test bob bet of 1eth", function() {
    
      return contract.Bet({from: bob, value: web3.toWei(1, "ether") }).then( tx => {
          balance = web3.fromWei(web3.eth.getBalance(contract.address).toNumber(),'ether'); 
          console.log("Contract after bob bet of 1eth: addr=" + contract.address + " -> balance=" + balance);
          assert.equal(1, balance, "Should have 1eth in contract");

          return contract.totalBets().then( totalBets => {
              console.log("Totalbets after bob bet of 1eth: " + totalBets);   
              assert.equal(1, totalBets, "Should have 1 bet in total");
          });  
      });
  });

  it("will test alice bet of 2eth", function() {

      return contract.Bet({from: alice, value: web3.toWei(2, "ether") }).then( tx => {
          balance = web3.fromWei(web3.eth.getBalance(contract.address).toNumber(),'ether'); 
          console.log("Contract after alice bet of 2eth: addr=" + contract.address + " -> balance=" + balance);
          assert.equal(3, balance, "Should have 3eth in contract");

          return contract.totalBets().then( totalBets => {
              console.log("Totalbets after alice bet of 2eth: " + totalBets);   
              assert.equal(2, totalBets, "Should have 2 bets in total");
          });  
      }); 
  });


  it("will get bob & alice bets", function() {

      return contract.GetBetInEther.call(bob).then( bet => {
          var bet_bob = web3.fromWei(bet.toNumber(),'ether');
          console.log("Check bob bet in ether:" + bet_bob);
          assert.equal(1, bet_bob, "bob should have a bet of 1eth");  
      
          return contract.GetBetInEther.call(alice).then( bet => {
            var bet_alice = web3.fromWei(bet.toNumber(),'ether');
            console.log("Check alice bet in ether:" + bet_alice);
            assert.equal(2, bet_alice, "alice should have a bet of 2eth");  
          });

      }); 
  });

  it("will compare user 1 & 2 in array with bob & alice addresses", function() {

      return contract.GetUserAddress.call(0).then( addr => {
          //var bet_bob = web3.fromWei(bet.toNumber(),'ether');
          console.log("Check user0(bob) address:" + addr);
          assert.equal(bob, addr, "Should be bob address");  
    

          return contract.GetUserAddress.call(1).then( addr => {
              //var bet_bob = web3.fromWei(bet.toNumber(),'ether');
              console.log("Check user1(alice) address:" + addr);
              assert.equal(alice, addr, "Should be alice address");  
          }); 

      }); 
  });

  it("will test random number", function() {
      return contract.testRandom.call().then( randomNum => { 
          console.log("A random number is [0 or 1] :" + randomNum);
      }); 
  });

  it("will end lottery", function() {

      balance_bob = web3.fromWei(web3.eth.getBalance(bob).toNumber(),'ether');
      balance_alice = web3.fromWei(web3.eth.getBalance(alice).toNumber(),'ether'); 
      console.log("bob: addr=" + bob + " -> balance=" + balance_bob);
      console.log("alice: addr=" + alice + " -> balance=" + balance_alice);

      return contract.EndLottery({from: bob}).then( end => {
          balance_bob = web3.fromWei(web3.eth.getBalance(bob).toNumber(),'ether');
          balance_alice = web3.fromWei(web3.eth.getBalance(alice).toNumber(),'ether'); 
          console.log("bob: addr=" + bob + " -> balance=" + balance_bob);
          console.log("alice: addr=" + alice + " -> balance=" + balance_alice);
          
          return contract.winningNumber().then( winningNumber => {
              console.log("winningNumber (issue as it is empty :-( " + winningNumber);   
              //assert.equal(2, totalBets, "Should have 2 bets in total");
          });  

      }); 

  });

});
