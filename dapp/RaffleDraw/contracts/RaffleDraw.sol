pragma solidity ^0.4.11;
 
contract RaffleDraw {
 
    //mapping(address => uint) internal usersBet;
    mapping(uint => string) public users;
    uint internal nbUsers = 0;

    mapping(uint => address) public admins;
    uint public nbAdmins = 0;
   
    mapping(uint => string) public prizes;
    uint public nbPrizes = 0;
   
    address internal owner;
    string public gameName;
    uint internal randomNum;
    uint public winningNumber;

    function RaffleDraw() {
        owner = msg.sender;
        admins[0] = owner;
        nbAdmins += 1;
        gameName = "RaffleDraw 1.0";
    }
    
    function IsAdmin(address addr) returns(bool){
        //return admins[0];
        for (uint i=0; i < nbAdmins; i++) {
            if (admins[0] == addr) {
                   return true;
                }
        }
        return false;
    }

    function AddUser(string user) public onlyByAdmin() {
        if (msg.sender == owner) {
            users[nbUsers] = user;
            nbUsers += 1;
        }
    } 

    function AddPrize(string prize) public onlyByAdmin() {
        prizes[nbPrizes] = prize;
        nbPrizes += 1;
    } 

    function testRandom() returns(uint) {
        randomNum = uint(block.blockhash(block.number-1)) % nbUsers;
        return randomNum;
    }

    modifier onlyByAdmin() {
        require(msg.sender == owner);
        _;
    }

}