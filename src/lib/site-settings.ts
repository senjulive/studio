
export type SiteSettings = {
  usdtDepositAddress: string;
  ethDepositAddress: string;
  btcDepositAddress: string;
};

export const defaultSiteSettings: SiteSettings = {
  usdtDepositAddress: 'TPAj58tX5n2hXpYZAe5V6b4s8g1zB4hP7x', // Default placeholder
  ethDepositAddress: '0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE', // Default placeholder
  btcDepositAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', // Default placeholder
};

// Returns the default settings directly as there is no database.
export async function getSiteSettings(): Promise<SiteSettings> {
  return Promise.resolve(defaultSiteSettings);
}
