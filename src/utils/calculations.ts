import { Position, PortfolioSnapshot } from '../types';

export function calculatePortfolioValue(
  positions: Position[],
  prices: Record<string, number>,
  cashBalance: number
): number {
  const investedValue = positions.reduce((sum, pos) => {
    const currentPrice = prices[pos.symbol] ?? pos.currentPrice;
    return sum + pos.quantity * currentPrice;
  }, 0);
  return cashBalance + investedValue;
}

export function calculateInvestedValue(
  positions: Position[],
  prices: Record<string, number>
): number {
  return positions.reduce((sum, pos) => {
    const currentPrice = prices[pos.symbol] ?? pos.currentPrice;
    return sum + pos.quantity * currentPrice;
  }, 0);
}

export function calculateTotalPnL(
  positions: Position[],
  prices: Record<string, number>
): { absolute: number; percentage: number } {
  let totalCost = 0;
  let totalValue = 0;
  for (const pos of positions) {
    const currentPrice = prices[pos.symbol] ?? pos.currentPrice;
    totalCost += pos.quantity * pos.avgCostBasis;
    totalValue += pos.quantity * currentPrice;
  }
  const absolute = totalValue - totalCost;
  const percentage = totalCost > 0 ? (absolute / totalCost) * 100 : 0;
  return { absolute, percentage };
}

export function calculatePositionPnL(
  position: Position,
  currentPrice: number
): { absolute: number; percentage: number } {
  const cost = position.quantity * position.avgCostBasis;
  const value = position.quantity * currentPrice;
  const absolute = value - cost;
  const percentage = cost > 0 ? (absolute / cost) * 100 : 0;
  return { absolute, percentage };
}

export function calculateDayChange(
  positions: Position[],
  prices: Record<string, number>,
  cashBalance: number
): { absolute: number; percentage: number } {
  let previousValue = cashBalance;
  let currentValue = cashBalance;

  for (const pos of positions) {
    const currentPrice = prices[pos.symbol] ?? pos.currentPrice;
    currentValue += pos.quantity * currentPrice;
    previousValue += pos.quantity * pos.previousClose;
  }

  const absolute = currentValue - previousValue;
  const percentage = previousValue > 0 ? (absolute / previousValue) * 100 : 0;
  return { absolute, percentage };
}

export function calculateDrawdown(snapshots: PortfolioSnapshot[]): number {
  if (snapshots.length < 2) return 0;
  let peak = snapshots[0].totalValue;
  let maxDrawdown = 0;

  for (const snap of snapshots) {
    if (snap.totalValue > peak) {
      peak = snap.totalValue;
    }
    const drawdown = peak > 0 ? (peak - snap.totalValue) / peak : 0;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  return maxDrawdown * 100; // as percentage
}

export function calculateRSI(prices: number[], period: number = 14): number[] {
  if (prices.length < period + 1) return [];

  const rsi: number[] = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period; i < prices.length; i++) {
    if (i > period) {
      const diff = prices[i] - prices[i - 1];
      const gain = diff > 0 ? diff : 0;
      const loss = diff < 0 ? Math.abs(diff) : 0;
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
    }
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi.push(100 - 100 / (1 + rs));
  }

  return rsi;
}

export function calculateSMA(prices: number[], period: number): number[] {
  const sma: number[] = [];
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return sma;
}

export function formatCurrency(value: number, decimals: number = 2): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return value < 0 ? `-$${formatted}` : `$${formatted}`;
}

export function formatPercent(value: number, showPlus: boolean = true): string {
  const sign = value > 0 && showPlus ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPrice(value: number, assetClass: string): string {
  if (assetClass === 'forex') {
    return value.toFixed(4);
  }
  return formatCurrency(value);
}

export function getPnLClass(value: number): string {
  if (value > 0) return 'text-emerald-600';
  if (value < 0) return 'text-red-500';
  return 'text-slate-500';
}
