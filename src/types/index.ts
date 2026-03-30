export type SkillLevel = 'novice' | 'apprentice' | 'trader' | 'analyst' | 'pro';

export type AssetClass = 'stocks' | 'options' | 'forex' | 'bonds_etfs';

export type OrderType = 'market' | 'limit' | 'stop';

export type OrderSide = 'buy' | 'sell';

export type OrderStatus = 'pending' | 'filled' | 'cancelled';

export type Mood = 'confident' | 'neutral' | 'nervous' | 'excited' | 'regretful';

export interface User {
  id: string;
  name: string;
  level: SkillLevel;
  xp: number;
  cashBalance: number;
  startingBalance: number;
  joinDate: string;
}

export interface Asset {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  basePrice: number;
  volatility: number;
  description: string;
}

export interface Position {
  id: string;
  symbol: string;
  assetClass: AssetClass;
  name: string;
  quantity: number;
  avgCostBasis: number;
  currentPrice: number;
  previousClose: number;
  openDate: string;
}

export interface Order {
  id: string;
  symbol: string;
  assetClass: AssetClass;
  name: string;
  type: OrderType;
  side: OrderSide;
  quantity: number;
  limitPrice?: number;
  stopPrice?: number;
  status: OrderStatus;
  filledPrice?: number;
  filledAt?: string;
  createdAt: string;
  note?: string;
}

export interface Trade {
  id: string;
  symbol: string;
  assetClass: AssetClass;
  name: string;
  side: OrderSide;
  quantity: number;
  price: number;
  total: number;
  timestamp: string;
  pnl?: number;
}

export interface JournalEntry {
  id: string;
  tradeId?: string;
  title: string;
  content: string;
  mood: Mood;
  tags: string[];
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  hint: string;
  icon: string;
  category: string;
  xpReward: number;
  unlockedAt?: string;
}

export interface PortfolioSnapshot {
  date: string;
  totalValue: number;
  cashBalance: number;
  investedValue: number;
}

export interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  category: string;
  minLevel: SkillLevel;
  duration: string;
  xpReward: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'achievement' | 'levelup';
}

export const LEVEL_THRESHOLDS: Record<SkillLevel, number> = {
  novice: 0,
  apprentice: 100,
  trader: 300,
  analyst: 700,
  pro: 1500,
};

export const LEVEL_COLORS: Record<SkillLevel, string> = {
  novice: '#64748B',
  apprentice: '#10B981',
  trader: '#3B82F6',
  analyst: '#8B5CF6',
  pro: '#F59E0B',
};

export const LEVEL_LABELS: Record<SkillLevel, string> = {
  novice: 'Novice',
  apprentice: 'Apprentice',
  trader: 'Trader',
  analyst: 'Analyst',
  pro: 'Pro',
};

export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  stocks: 'Stocks',
  options: 'Options',
  forex: 'Forex',
  bonds_etfs: 'Bonds & ETFs',
};

export const ASSET_CLASS_MIN_LEVEL: Record<AssetClass, SkillLevel> = {
  stocks: 'novice',
  forex: 'trader',
  options: 'analyst',
  bonds_etfs: 'pro',
};

export function getLevelFromXP(xp: number): SkillLevel {
  if (xp >= LEVEL_THRESHOLDS.pro) return 'pro';
  if (xp >= LEVEL_THRESHOLDS.analyst) return 'analyst';
  if (xp >= LEVEL_THRESHOLDS.trader) return 'trader';
  if (xp >= LEVEL_THRESHOLDS.apprentice) return 'apprentice';
  return 'novice';
}

export function getNextLevelXP(xp: number): { nextLevel: SkillLevel | null; xpNeeded: number; xpForNext: number } {
  const levels: SkillLevel[] = ['novice', 'apprentice', 'trader', 'analyst', 'pro'];
  const current = getLevelFromXP(xp);
  const currentIndex = levels.indexOf(current);
  if (currentIndex === levels.length - 1) {
    return { nextLevel: null, xpNeeded: 0, xpForNext: LEVEL_THRESHOLDS.pro };
  }
  const nextLevel = levels[currentIndex + 1];
  const xpForNext = LEVEL_THRESHOLDS[nextLevel];
  return { nextLevel, xpNeeded: xpForNext - xp, xpForNext };
}

export function isAssetClassUnlocked(assetClass: AssetClass, level: SkillLevel): boolean {
  const levels: SkillLevel[] = ['novice', 'apprentice', 'trader', 'analyst', 'pro'];
  const minLevel = ASSET_CLASS_MIN_LEVEL[assetClass];
  return levels.indexOf(level) >= levels.indexOf(minLevel);
}

export function isOrderTypeUnlocked(orderType: OrderType, level: SkillLevel): boolean {
  if (orderType === 'market') return true;
  if (orderType === 'limit' || orderType === 'stop') {
    const levels: SkillLevel[] = ['novice', 'apprentice', 'trader', 'analyst', 'pro'];
    return levels.indexOf(level) >= levels.indexOf('apprentice');
  }
  return false;
}
