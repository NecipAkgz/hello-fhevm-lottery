const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const LotteryModule = buildModule("LotteryModule", (m) => {
  const lottery = m.contract("ConfidentialLottery");

  return { lottery };
});

module.exports = LotteryModule;
