pragma solidity ^0.4.11;
 
contract RaffleDraw {
 
    string[] public users;
    string[] public prizes;

    address internal owner;
    string public gameName;

    uint public winningNumber;

    function RaffleDraw() {
        owner = msg.sender;
        gameName = "RaffleDraw 1.0";
    }
    
    function AddUser(string user) public onlyByAdmin() {
        users.push(user);
    } 
    
    function RemoveUser(uint index) public onlyByAdmin() {
        delete users[index];
        users[index]=users[users.length-1];
        users.length --;
    }

    function NbUsers() returns(uint) {
        return users.length;
    }

    function AddPrize(string prize) public onlyByAdmin() {
        prizes.push(prize);
    } 

    function RemovePrize(uint index) public onlyByAdmin() {
        delete prizes[index];
        prizes[index]=prizes[prizes.length-1];
        prizes.length --;
    }

    function NbPrizes() returns(uint) {
        return prizes.length;
    }

    function TestRandom() returns(uint) {
        uint random = uint(block.blockhash(block.number-1)) % users.length;
        return random;
    }

    function DrawUser() returns(string) {
        uint random = uint(block.blockhash(block.number-1)) % users.length;
        var winner = users[random];
        RemoveUser(random);
        return winner;
    }

    function DrawPrize() returns(string) {
        uint random = uint(block.blockhash(block.number-1)) % prizes.length;
        var prize = prizes[random];
        RemovePrize(random);
        return prize;
    }

    modifier onlyByAdmin() {
        require(msg.sender == owner);
        _;
    }

}