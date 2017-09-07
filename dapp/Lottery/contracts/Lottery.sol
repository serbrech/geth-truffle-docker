pragma solidity ^0.4.11;
 
contract Lottery {
 
    mapping(address => uint) internal usersBet;
    mapping(uint => address) internal users;
    uint internal nbUsers = 0;
    uint public totalBets = 0;
    address internal owner;
    string public gameName;
    uint internal randomNum;
    uint public winningNumber;

    function Lottery() {
        owner = msg.sender;
        gameName = "$Lottery$ 1.0";
    }
    
    function Bet() public payable  {
        if (msg.value > 0) {
            if (usersBet[msg.sender] == 0) {
                users[nbUsers] = msg.sender;
                nbUsers += 1;
            }
            usersBet[msg.sender] += msg.value;
            totalBets += 1;
            //msg.value;
        }
    }
    
    function GetBetInEther(address addr) returns(uint){
        return usersBet[addr];
    }

    function GetUserAddress(uint nb) returns(address){
        return users[nb];
    }

    function testRandom() returns(uint) {
        randomNum = uint(block.blockhash(block.number-1)) % totalBets;
        return randomNum;
    }

    function EndLottery() public returns(uint) {
        if (msg.sender == owner) {
            uint sum = 0;
            winningNumber = uint(block.blockhash(block.number-1)) % totalBets;
            for (uint i=0; i < nbUsers; i++) {
                sum += usersBet[users[i]];
                if (sum >= winningNumber) {
                    selfdestruct(users[i]);
                    return;
                }
            }
        }
    }
    
}