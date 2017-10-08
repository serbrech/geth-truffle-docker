pragma solidity ^0.4.11;
 
contract RaffleDraw {
 
    struct Users {
        string name;
        string prize;
        bool drawn;
        bool accepted;
    }

    Users[] public users;
    string[] public prizes;

    address internal owner;
    string public gameName;

    uint public winningNumber;

    function RaffleDraw() {
        owner = msg.sender;
        gameName = "RaffleDraw 1.0";
    }
    
    function AddUser(string name) public onlyByAdmin() {
        users.push(Users(name, "", false, false));
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

    // Will get user and prize index, followed by winner name and prize description
    function Draw() returns(uint, uint, string, string)  {
        uint randomU = uint(block.blockhash(block.number-1)) % users.length;
        //uint randomU = 1;
        var winner = users[randomU].name;
        users[randomU].drawn = true;

        uint randomP = uint(block.blockhash(block.number-1)) % prizes.length;
        var prize = prizes[randomP];
        return (randomU, randomP, winner, prize);
    }

    // Given last draw (user+prize index), we will get a new winner index+name, with same prize
    // function ReDrawUser(uint indexU, uint indexP) returns(uint, string)  {
    //     uint randomName = uint(block.blockhash(block.number-1)) % users.length;
    //     var newWinner = users[randomName].name;
    //     users[randomName].drawn = true;
    //     users[indexU].drawn = true; // reset previous winner
    //     return (randomName, newWinner);
    // }

    function AcceptDraw(uint indexU, uint indexP) public onlyByAdmin() {
        users[indexU].prize = prizes[indexP];
        users[indexU].accepted = true;
        //users[indexU].drawn = true;
        RemovePrize(indexP);
    }

    modifier onlyByAdmin() {
        require(msg.sender == owner);
        _;
    }

}