const getNewExpValue = (currentRank) => {
  const caps = [2000, 5000, 20000, 50000, 200000];
  return caps[currentRank];
};

module.exports = { getNewExpValue };
