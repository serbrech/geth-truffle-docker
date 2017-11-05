pragma solidity ^0.4.11;

import "./Mortal.sol";

contract Greeter is Mortal {
    // define variable greeting of the type string
    string greeting;
    
    // this runs when the contract is executed
    function Greeter(string _greeting) public {
        greeting = _greeting;
    }

    // Display the content of variable greeting
    function Greet() constant returns (string) {
        return greeting;
    }

    // Set the content of variable greeting
    function SetGreet(string _greeting) public {
        greeting = _greeting;
    }
}
