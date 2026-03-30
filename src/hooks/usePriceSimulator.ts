import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { ASSETS } from '../data/assets';
import { simulatePriceUpdate } from '../utils/priceSimulator';

const UPDATE_INTERVAL_MS = 3000;

export function usePriceSimulator() {
  const {
    prices,
    updatePrice,
    processLimitOrders,
    takeSnapshot,
    initPrices,
    onboardingDone,
    positions,
  } = useStore();

  const tickRef = useRef(0);
  const prevSnapshotDayRef = useRef<string>('');

  useEffect(() => {
    if (!onboardingDone) return;

    // Initialize prices if not done yet
    if (Object.keys(prices).length === 0) {
      initPrices();
      return;
    }

    const interval = setInterval(() => {
      tickRef.current += 1;

      const newPrices: Record<string, number> = { ...prices };

      for (const asset of ASSETS) {
        const current = prices[asset.symbol] ?? asset.basePrice;
        const next = simulatePriceUpdate(current, asset.volatility);
        const rounded = asset.assetClass === 'forex'
          ? parseFloat(next.toFixed(4))
          : parseFloat(next.toFixed(2));
        newPrices[asset.symbol] = rounded;
        updatePrice(asset.symbol, rounded);
      }

      // Update position current prices
      const store = useStore.getState();
      const updatedPositions = store.positions.map(pos => ({
        ...pos,
        currentPrice: newPrices[pos.symbol] ?? pos.currentPrice,
      }));

      // Only update if positions exist
      if (updatedPositions.length > 0) {
        useStore.setState({ positions: updatedPositions });
      }

      // Process limit/stop orders on every tick
      processLimitOrders(newPrices);

      // Take a snapshot every ~20 ticks (~1 minute of sim time, represents a "day")
      const simDay = Math.floor(tickRef.current / 20).toString();
      if (simDay !== prevSnapshotDayRef.current) {
        prevSnapshotDayRef.current = simDay;
        // Update previousClose for each position
        if (positions.length > 0) {
          useStore.setState(s => ({
            positions: s.positions.map(pos => ({
              ...pos,
              previousClose: s.prices[pos.symbol] ?? pos.currentPrice,
            })),
          }));
        }
        takeSnapshot();
      }
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [onboardingDone, Object.keys(prices).length]);
}
