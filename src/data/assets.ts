import { Asset, AssetClass } from '../types';

export const ASSETS: Asset[] = [
  // Stocks
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    assetClass: 'stocks',
    basePrice: 189.50,
    volatility: 0.015,
    description: 'Technology giant known for iPhone, Mac, and services. One of the most traded stocks in the world.',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    assetClass: 'stocks',
    basePrice: 374.20,
    volatility: 0.013,
    description: 'Software and cloud computing leader. Makes Windows, Office, and Azure cloud services.',
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    assetClass: 'stocks',
    basePrice: 140.80,
    volatility: 0.016,
    description: "Parent company of Google. Makes money through advertising, cloud computing, and YouTube.",
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    assetClass: 'stocks',
    basePrice: 178.60,
    volatility: 0.018,
    description: "World's largest e-commerce and cloud computing company. AWS is their most profitable division.",
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    assetClass: 'stocks',
    basePrice: 245.30,
    volatility: 0.028,
    description: 'Electric vehicle and clean energy company. Known for high volatility and passionate investors.',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp.',
    assetClass: 'stocks',
    basePrice: 495.80,
    volatility: 0.025,
    description: 'Graphics chip maker powering AI and gaming. Massive growth due to AI computing demand.',
  },
  {
    symbol: 'META',
    name: 'Meta Platforms',
    assetClass: 'stocks',
    basePrice: 358.40,
    volatility: 0.020,
    description: 'Parent of Facebook, Instagram, and WhatsApp. Advertising-driven social media giant.',
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase',
    assetClass: 'stocks',
    basePrice: 196.70,
    volatility: 0.012,
    description: "America's largest bank. Provides consumer banking, investment banking, and financial services.",
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    assetClass: 'stocks',
    basePrice: 258.90,
    volatility: 0.010,
    description: 'Global payments network. Processes credit and debit card transactions worldwide.',
  },
  {
    symbol: 'WMT',
    name: 'Walmart Inc.',
    assetClass: 'stocks',
    basePrice: 168.40,
    volatility: 0.008,
    description: "World's largest retailer. Known for low prices and steady, defensive stock performance.",
  },

  // Forex
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    assetClass: 'forex',
    basePrice: 1.0850,
    volatility: 0.003,
    description: 'The most traded currency pair in the world. Shows how many dollars one euro can buy.',
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    assetClass: 'forex',
    basePrice: 1.2680,
    volatility: 0.004,
    description: 'Called "Cable" by traders. Shows how many dollars one British pound can buy.',
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    assetClass: 'forex',
    basePrice: 149.80,
    volatility: 0.004,
    description: 'Shows how many yen one US dollar buys. Higher numbers mean a stronger dollar vs. yen.',
  },
  {
    symbol: 'AUD/USD',
    name: 'Australian Dollar / US Dollar',
    assetClass: 'forex',
    basePrice: 0.6520,
    volatility: 0.005,
    description: 'The "Aussie". Closely tied to commodity prices, especially iron ore and coal.',
  },
  {
    symbol: 'USD/CAD',
    name: 'US Dollar / Canadian Dollar',
    assetClass: 'forex',
    basePrice: 1.3540,
    volatility: 0.003,
    description: 'Called the "Loonie". Closely linked to oil prices given Canada\'s oil exports.',
  },

  // Options
  {
    symbol: 'AAPL-CALL-190',
    name: 'AAPL Call $190',
    assetClass: 'options',
    basePrice: 8.40,
    volatility: 0.040,
    description: 'A call option gives you the right to BUY Apple shares at $190. Profits if AAPL rises above $190.',
  },
  {
    symbol: 'AAPL-PUT-185',
    name: 'AAPL Put $185',
    assetClass: 'options',
    basePrice: 6.20,
    volatility: 0.038,
    description: 'A put option gives you the right to SELL Apple shares at $185. Profits if AAPL falls below $185.',
  },
  {
    symbol: 'TSLA-CALL-250',
    name: 'TSLA Call $250',
    assetClass: 'options',
    basePrice: 14.80,
    volatility: 0.055,
    description: 'A call option on Tesla at $250 strike. High volatility means bigger swings in option price.',
  },
  {
    symbol: 'SPY-CALL-480',
    name: 'SPY Call $480',
    assetClass: 'options',
    basePrice: 11.30,
    volatility: 0.030,
    description: 'A call option on the S&P 500 ETF. Lets you speculate on the broad market moving up.',
  },

  // Bonds & ETFs
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    assetClass: 'bonds_etfs',
    basePrice: 478.60,
    volatility: 0.009,
    description: 'Tracks the S&P 500 index — 500 of the largest US companies. Great for broad diversification.',
  },
  {
    symbol: 'QQQ',
    name: 'Invesco NASDAQ-100 ETF',
    assetClass: 'bonds_etfs',
    basePrice: 415.30,
    volatility: 0.012,
    description: 'Tracks the top 100 NASDAQ companies, heavily weighted toward tech. More volatile than SPY.',
  },
  {
    symbol: 'BND',
    name: 'Vanguard Bond ETF',
    assetClass: 'bonds_etfs',
    basePrice: 73.20,
    volatility: 0.003,
    description: 'Holds thousands of US bonds. Lower risk than stocks, provides steady income via dividends.',
  },
  {
    symbol: 'GLD',
    name: 'SPDR Gold ETF',
    assetClass: 'bonds_etfs',
    basePrice: 186.40,
    volatility: 0.007,
    description: 'Tracks the price of gold. Often rises when stocks fall — used as a safe haven.',
  },
  {
    symbol: 'TLT',
    name: 'iShares 20+ Year Treasury',
    assetClass: 'bonds_etfs',
    basePrice: 96.80,
    volatility: 0.008,
    description: 'Holds long-term US government bonds. Price moves inversely to interest rates.',
  },
  {
    symbol: 'VTI',
    name: 'Vanguard Total Market ETF',
    assetClass: 'bonds_etfs',
    basePrice: 236.70,
    volatility: 0.009,
    description: 'Owns almost every publicly traded US company — about 4,000 stocks. Ultimate diversification.',
  },
  {
    symbol: 'AGG',
    name: 'iShares Core US Aggregate Bond',
    assetClass: 'bonds_etfs',
    basePrice: 95.60,
    volatility: 0.003,
    description: 'Tracks the US investment-grade bond market. Considered a cornerstone of conservative portfolios.',
  },
];

export const ASSET_MAP: Record<string, Asset> = Object.fromEntries(
  ASSETS.map(a => [a.symbol, a])
);

export function getAssetsByClass(assetClass: AssetClass): Asset[] {
  return ASSETS.filter(a => a.assetClass === assetClass);
}
