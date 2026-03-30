import { Candle } from '../types';

// Box-Muller transform for normally distributed random numbers
function randomNormal(mean: number = 0, std: number = 1): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Simulate a single price update using geometric random walk
export function simulatePriceUpdate(
  currentPrice: number,
  volatility: number,
  drift: number = 0.00002
): number {
  const change = randomNormal(drift, volatility);
  const newPrice = currentPrice * (1 + change);
  // Prevent negative prices
  return Math.max(newPrice, currentPrice * 0.5);
}

// Generate an array of closing prices for historical data
export function generatePriceHistory(
  basePrice: number,
  volatility: number,
  days: number,
  seed?: number
): number[] {
  // Use seeded random for deterministic history
  let price = basePrice;
  const prices: number[] = [price];

  // Simple seeded PRNG
  let s = seed ?? Math.floor(basePrice * 100);
  function seededRandom() {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  }

  function seededNormal() {
    let u = 0, v = 0;
    while (u === 0) u = seededRandom();
    while (v === 0) v = seededRandom();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  for (let i = 1; i < days; i++) {
    const change = 0.00005 + seededNormal() * volatility;
    price = Math.max(price * (1 + change), price * 0.3);
    prices.push(price);
  }

  return prices;
}

// Generate OHLC candles from a base price
export function generateCandles(
  basePrice: number,
  volatility: number,
  days: number = 30,
  seed?: number
): Candle[] {
  const closes = generatePriceHistory(basePrice, volatility, days, seed);
  const candles: Candle[] = [];

  const now = new Date();

  for (let i = 0; i < closes.length; i++) {
    const close = closes[i];
    const open = i === 0 ? close : closes[i - 1];
    const swing = close * volatility * 1.5;
    const high = Math.max(open, close) + Math.abs(swing * Math.random());
    const low = Math.min(open, close) - Math.abs(swing * Math.random());
    const volume = Math.floor(1000000 + Math.random() * 9000000);

    const date = new Date(now);
    date.setDate(date.getDate() - (closes.length - 1 - i));

    candles.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      close: parseFloat(close.toFixed(4)),
      volume,
    });
  }

  return candles;
}

// Initialize prices for all assets with small random offsets from base
export function initializePrices(
  assets: { symbol: string; basePrice: number; volatility: number }[]
): Record<string, number> {
  const prices: Record<string, number> = {};
  for (const asset of assets) {
    // Small random offset (±3%) from base price for variety
    const offset = 1 + (Math.random() - 0.5) * 0.06;
    prices[asset.symbol] = parseFloat((asset.basePrice * offset).toFixed(4));
  }
  return prices;
}
