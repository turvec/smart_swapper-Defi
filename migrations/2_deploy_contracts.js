const SmartSwapper = artifacts.require("SmartSwapper");

const TurvCoin = artifacts.require("TurvCoin");

module.exports = async function(deployer) {
  //Deploy turv TurvCoin
  await deployer.deploy(TurvCoin);

  const turvCoin = await TurvCoin.deployed()

  //Deploy SmartSwapper
  await deployer.deploy(SmartSwapper, turvCoin.address);

  const smartSwapper = await SmartSwapper.deployed()

  //Tranfer all turv token to smartSwapper (1 million)
  await turvCoin.transfer(smartSwapper.address, '1000000000000000000000000')
};