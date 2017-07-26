var ConvertLib = artifacts.require("./ConvertLib.sol");
var Counter = artifacts.require("./Counter.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, Counter);
  deployer.deploy(Counter);
};
