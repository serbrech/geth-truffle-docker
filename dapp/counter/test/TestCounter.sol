pragma solidity ^0.4.11;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Counter.sol";

contract TestCounter {

  function testDefaultValue() {
    Counter count = Counter(DeployedAddresses.Counter());
    uint expected = 0;
    Assert.equal(count.getCount(), expected, "Default counter should be 0");
  }

  function testOneIncrement() {
    Counter count = Counter(DeployedAddresses.Counter());
    count.increment();
    uint expected = 1;
    Assert.equal(count.getCount(), expected, "One increment from 0 should be 1");
  }

}
