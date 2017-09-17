pragma solidity ^0.4.11;
 
contract RaffleDraw {
 
    //mapping(address => uint) internal usersBet;
    mapping(uint => string) public users;
    uint public nbUsers = 0;

    mapping(uint => string) public prizes;
    uint public nbPrizes = 0;
    
    mapping(string => bool) internal usersDrawed;
    mapping(string => bool) internal prizesDrawed;
    uint public nbDraw = 0;

    address internal owner;
    string public gameName;

    uint public winningNumber;

    function RaffleDraw() {
        owner = msg.sender;
        gameName = "RaffleDraw 1.0";
    }
    
    function AddUser(string user) public onlyByAdmin() {
        users[nbUsers] = user;
        nbUsers += 1;
    } 

    function AddPrize(string prize) public onlyByAdmin() {
        prizes[nbPrizes] = prize;
        nbPrizes += 1;
    } 

    function testRandom() returns(uint) {
        uint randomNum = uint(block.blockhash(block.number-1)) % nbUsers;
        return randomNum;
    }

    function DrawUser() returns(string) {
    
        uint i = 0;
        uint randomUser = uint(block.blockhash(block.number-1)) % nbUsers;
        var winner = users[randomUser];
    
        for (var i = 0; i < nbUsers; i++) {

            randomUser = uint(block.blockhash(block.number-1)) % nbUsers;
            while (usersDrawed[winner] == true) {
            
        


            winner = users[randomUser];
            //if (i >= nbDraw) { "stop"}
            i++;
        }
        usersDrawed[winner] == true
        return (winner);
    }

    // function DrawPrize() returns(string) {

    //     uint randomPrize = uint(block.blockhash(block.number-1)) % nbPrizes;
    //     var prize = prizes[randomPrize];
        
    //     return (prize);
    // }

    function ConfirmDraw(string prize, string user) {
        usersDrawed[user] = true;
        prizesDrawed[prize] = true;
        nbDraw += 1;
    }


    modifier onlyByAdmin() {
        require(msg.sender == owner);
        _;
    }

}