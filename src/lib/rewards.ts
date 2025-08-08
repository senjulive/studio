// Client-safe rewards module - uses static data

const rewardSettings = {
  rankAchievementBonus: 10,
  tierAchievementBonus: 5,
  referralBonusTier1: 5,
  referralBonusTier2: 1,
  newUserBonus: 5,
};

export async function getRewardSettings() {
  return rewardSettings;
}
