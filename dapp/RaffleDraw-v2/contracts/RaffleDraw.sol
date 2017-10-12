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


    function RaffleDraw() {
        owner = msg.sender;
        gameName = "RaffleDraw 1.0";
    }
    
    function AddUser(string name) onlyByAdmin() {
        users.push(Users(name, "", false, false));
    }

    function NbUsers() constant returns(uint) {
        return users.length;
    }

    function AddPrize(string prize) onlyByAdmin() {
        prizes.push(prize);
    }

    function RemovePrize(uint index) onlyByAdmin() {
        delete prizes[index];
        prizes[index]=prizes[prizes.length-1];
        prizes.length --;
    }

    function NbPrizes() constant returns(uint) {
        return prizes.length;
    }

    event DrawEvent(uint randomU, uint randomP, string winner, string prize);

    // Will get user and prize index, followed by winner name and prize description
    function Draw() onlyByAdmin() returns(bool) {


        // ####################### test edge cases!!!
        // exit if no user or no prize
        require(users.length > 0);
        require(prizes.length > 0);

        uint randomU = uint(block.blockhash(block.number-1)) % users.length;
        var winner = users[randomU].name;
        users[randomU].drawn = true;

        uint randomP = uint(block.blockhash(block.number-1)) % prizes.length;
        var prize = prizes[randomP];

        DrawEvent(randomU, randomP, winner, prize);
        return true;
    }

    event ReDrawUserEvent(uint newRandomU, string newWinner);

    //Given last draw (user&prize index), we will get a new winner index and name, we are not touching the prize
    function ReDrawUser(uint indexU, uint indexP) onlyByAdmin() returns(bool) {

        require(users.length > 1); // need at minimum 2 users to swap each other
        require(indexP < prizes.length && prizes.length > 0); // a prize should exit

        uint newRandomU = uint(block.blockhash(block.number-1)) % users.length;
        // exit if only 1 user left
        if (users.length == 1) { return; }
        // choose a different user than the one we want to replace
        if (newRandomU == indexU) { newRandomU = newRandomU + 1; }
        // if we are out of the table, choose the preceding user
        if (newRandomU > users.length) { newRandomU = newRandomU - 1; }
        
        var newWinner = users[newRandomU].name;
        //users[newRandomU].drawn = true;
        users[indexU].drawn = false; // reset previous winner

        ReDrawUserEvent(newRandomU, newWinner);
        return true;
    }

    event AcceptDrawEvent(string winner, string prize);

    function AcceptDraw(uint indexU, uint indexP) onlyByAdmin() returns(bool) {
        var prize = prizes[indexP];
        users[indexU].prize = prizes[indexP];
        
        var winner = users[indexU].name;
        users[indexU].accepted = true;

        AcceptDrawEvent(winner, prize);

        RemovePrize(indexP);
        return true;
    }

    modifier onlyByAdmin() {
        require(msg.sender == owner);
        _;
    }

    // event TestRandomEvent(uint random, bool returnValue);

    // function TestRandom() public returns(bool) {
    //     uint random = uint(block.blockhash(block.number-1)) % users.length;
    //     TestRandomEvent(random, true);
    //     return true;
    // }

}