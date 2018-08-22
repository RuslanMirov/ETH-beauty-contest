var BeautyContest = artifacts.require("./BeautyContest.sol");

module.exports = function(deployer) {
  deployer.deploy(BeautyContest);
};