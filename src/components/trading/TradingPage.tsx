import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useStore } from '../../store';
import { ASSETS } from '../../data/assets';
import { Asset, AssetClass, ASSET_CLASS_LABELS, isAssetClassUnlocked, isOrderTypeUnlocked } from '../../types';
import {
  formatCurrency, formatPercent, getPnLClass, calculateSMA, calculateRSI,
} from '../../utils/calculations';
import { generateCandles } from '../../utils/priceSimulator';
import { Tooltip } from '../common/Tooltip';

const ASSET_CLASS_TABS: { id: AssetClass; label: string; icon: string }[] = [
  { id: 'stocks', label: 'Stocks', icon: '📈' },
  { id: 'forex', label: 'Forex', icon: '💱' },
  { id: 'options', label: 'Options', icon: '📋' },
  { id: 'bonds_etfs', label: 'Bonds/ETFs', icon: '🏦' },
];

function AssetRow({ asset, onSelect, isSelected }: { asset: Asset; onSelect: () => void; isSelected: boolean }) {
  const { prices } = useStore();
  const price = prices[asset.symbol] ?? asset.basePrice;
  const prevPrice = asset.basePrice;
  const change = ((price - prevPrice) / prevPrice) * 100;

  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
        isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'
      }`}
    >
      <div>
        <p className="text-sm font-semibold text-slate-800">{asset.symbol}</p>
        <p className="text-xs text-slate-400 truncate max-w-[120px]">{asset.name}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-slate-800">
          {asset.assetClass === 'forex' ? price.toFixed(4) : formatCurrency(price)}
        </p>
        <p className={`text-xs font-medium ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {formatPercent(change)}
        </p>
      </div>
    </button>
  );
}

function OrderEntry({ asset }: { asset: Asset }) {
  const { user, prices, positions, placeOrder, addNotification } = useStore();
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [quantity, setQuantity] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPrice = prices[asset.symbol] ?? asset.basePrice;
  const qty = parseFloat(quantity) || 0;
  const estimatedTotal = qty * currentPrice;
  const spread = currentPrice * 0.001; // 0.1% spread
  const position = positions.find(p => p.symbol === asset.symbol);

  const canUseLimitStop = isOrderTypeUnlocked('limit', user.level);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (qty <= 0) {
      addNotification('Please enter a valid quantity.', 'error');
      return;
    }

    setIsSubmitting(true);
    const result = placeOrder({
      asset,
      type: orderType,
      side,
      quantity: qty,
      limitPrice: limitPrice ? parseFloat(limitPrice) : undefined,
      stopPrice: stopPrice ? parseFloat(stopPrice) : undefined,
      note: note || undefined,
    });

    setTimeout(() => setIsSubmitting(false), 300);

    if (!result.success) {
      addNotification(result.message, 'error');
    } else {
      setQuantity('');
      setLimitPrice('');
      setStopPrice('');
      setNote('');
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-3">Place Order</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Buy / Sell toggle */}
        <div className="flex rounded-lg overflow-hidden border border-slate-200">
          <button
            type="button"
            onClick={() => setSide('buy')}
            className={`flex-1 py-2 text-sm font-semibold transition-all ${
              side === 'buy'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            BUY
          </button>
          <button
            type="button"
            onClick={() => setSide('sell')}
            className={`flex-1 py-2 text-sm font-semibold transition-all ${
              side === 'sell'
                ? 'bg-red-500 text-white'
                : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            SELL
          </button>
        </div>

        {/* Order type */}
        <div>
          <div className="flex items-center gap-1 mb-1 text-xs text-slate-500">
            <span>Order Type</span>
            <Tooltip content="Market: fills immediately at current price. Limit: only fills at your specified price or better. Stop: triggers when price hits your level." />
          </div>
          <div className="flex gap-1.5">
            {(['market', 'limit', 'stop'] as const).map(type => (
              <button
                key={type}
                type="button"
                disabled={!isOrderTypeUnlocked(type, user.level)}
                onClick={() => setOrderType(type)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                  orderType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
                title={!isOrderTypeUnlocked(type, user.level) ? 'Unlocks at Apprentice level' : ''}
              >
                {type}
              </button>
            ))}
          </div>
          {!canUseLimitStop && (
            <p className="text-xs text-amber-600 mt-1">Limit & Stop orders unlock at Apprentice level</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <div className="flex items-center gap-1 mb-1 text-xs text-slate-500">
            <span>Quantity (shares)</span>
            <Tooltip content="How many shares or units you want to buy or sell." />
          </div>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          {qty > 0 && (
            <p className="text-xs text-slate-400 mt-1">
              ≈ {formatCurrency(estimatedTotal)} at current price
            </p>
          )}
        </div>

        {/* Limit price */}
        {orderType === 'limit' && (
          <div>
            <div className="flex items-center gap-1 mb-1 text-xs text-slate-500">
              <span>Limit Price</span>
              <Tooltip content="Your order will only fill if the price reaches this level. Buy limit: fills at this price or lower. Sell limit: fills at this price or higher." />
            </div>
            <input
              type="number"
              min="0.0001"
              step="0.01"
              value={limitPrice}
              onChange={e => setLimitPrice(e.target.value)}
              placeholder={`Current: ${currentPrice.toFixed(2)}`}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
        )}

        {/* Stop price */}
        {orderType === 'stop' && (
          <div>
            <div className="flex items-center gap-1 mb-1 text-xs text-slate-500">
              <span>Stop Price</span>
              <Tooltip content="Your order triggers when the price hits this level. Stop-loss: set below current price to limit losses. Stop-buy: set above to enter on breakout." />
            </div>
            <input
              type="number"
              min="0.0001"
              step="0.01"
              value={stopPrice}
              onChange={e => setStopPrice(e.target.value)}
              placeholder={`Current: ${currentPrice.toFixed(2)}`}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
        )}

        {/* Spread info */}
        <div className="bg-slate-50 rounded-lg p-2.5 text-xs text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              Bid/Ask Spread
              <Tooltip content="The gap between what buyers will pay (bid) and what sellers want (ask). You always buy at the ask and sell at the bid." />
            </span>
            <span>~${spread.toFixed(4)}</span>
          </div>
          {orderType === 'market' && (
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                Est. Slippage
                <Tooltip content="Market orders may fill at a slightly different price due to fast-moving markets. Usually very small." />
              </span>
              <span>0.05–0.25%</span>
            </div>
          )}
          {qty > 0 && (
            <div className="flex justify-between font-medium text-slate-700">
              <span>Estimated Total</span>
              <span>{formatCurrency(estimatedTotal)}</span>
            </div>
          )}
        </div>

        {/* Current position info */}
        {position && (
          <div className="text-xs text-slate-500 bg-blue-50 rounded-lg p-2">
            You hold <strong>{position.quantity}</strong> shares at avg cost{' '}
            <strong>{formatCurrency(position.avgCostBasis)}</strong>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || qty <= 0}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
            side === 'buy'
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? 'Placing...' : `${side === 'buy' ? 'Buy' : 'Sell'} ${asset.symbol}`}
        </button>

        <p className="text-center text-xs text-slate-400">
          {side === 'buy'
            ? `Available: ${formatCurrency(user.cashBalance)}`
            : `Holdings: ${position?.quantity ?? 0} shares`}
        </p>
      </form>
    </div>
  );
}

function PriceChart({ asset }: { asset: Asset }) {
  const { prices, priceHistory, user } = useStore();

  const currentPrice = prices[asset.symbol] ?? asset.basePrice;
  const history = priceHistory[asset.symbol] ?? [];

  // Combine generated historical candles with live price history
  const generatedCandles = useMemo(
    () => generateCandles(asset.basePrice, asset.volatility, 30, Math.floor(asset.basePrice * 100)),
    [asset.symbol]
  );

  const chartData = useMemo(() => {
    const candleData = generatedCandles.map(c => ({ date: c.date, close: c.close }));
    // Append live prices
    const liveData = history.slice(-20).map((p, i) => ({
      date: `Now -${history.slice(-20).length - 1 - i}`,
      close: p,
    }));
    return [...candleData, ...liveData];
  }, [generatedCandles, history]);

  const closePrices = chartData.map(d => d.close);
  const ma20 = calculateSMA(closePrices, 20);
  const ma50 = calculateSMA(closePrices, 50);
  const rsiValues = calculateRSI(closePrices, 14);

  const showMA = ['trader', 'analyst', 'pro'].includes(user.level);
  const showRSI = ['trader', 'analyst', 'pro'].includes(user.level);

  const chartDataWithIndicators = chartData.map((d, i) => ({
    ...d,
    ma20: ma20[i - (closePrices.length - ma20.length)] ?? null,
    ma50: ma50[i - (closePrices.length - ma50.length)] ?? null,
    rsi: rsiValues[i - (closePrices.length - rsiValues.length)] ?? null,
  }));

  const priceMin = Math.min(...closePrices) * 0.995;
  const priceMax = Math.max(...closePrices) * 1.005;
  const startPrice = chartData[0]?.close ?? asset.basePrice;
  const pctChange = ((currentPrice - startPrice) / startPrice) * 100;

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-800">{asset.symbol} — {asset.name}</h3>
          <p className="text-xs text-slate-400">{ASSET_CLASS_LABELS[asset.assetClass]}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-slate-800">
            {asset.assetClass === 'forex' ? currentPrice.toFixed(4) : formatCurrency(currentPrice)}
          </p>
          <p className={`text-sm font-medium ${getPnLClass(pctChange)}`}>
            {formatPercent(pctChange)} (30d)
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartDataWithIndicators} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="date" tick={false} axisLine={false} tickLine={false} />
          <YAxis
            domain={[priceMin, priceMax]}
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            tickLine={false}
            axisLine={false}
            width={55}
            tickFormatter={(v) => asset.assetClass === 'forex' ? v.toFixed(4) : `$${v.toFixed(0)}`}
          />
          <RechartsTooltip
            formatter={(v: number, name: string) => {
              const labels: Record<string, string> = { close: 'Price', ma20: 'MA20', ma50: 'MA50' };
              return [asset.assetClass === 'forex' ? v.toFixed(4) : `$${v.toFixed(2)}`, labels[name] ?? name];
            }}
            contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px' }}
          />
          <Line type="monotone" dataKey="close" stroke="#3B82F6" strokeWidth={2} dot={false} />
          {showMA && <Line type="monotone" dataKey="ma20" stroke="#F59E0B" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />}
          {showMA && <Line type="monotone" dataKey="ma50" stroke="#8B5CF6" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />}
        </LineChart>
      </ResponsiveContainer>

      {showMA && (
        <div className="flex gap-4 mt-1 text-xs text-slate-400">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-400 inline-block" /> MA20</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-purple-400 inline-block" /> MA50</span>
        </div>
      )}

      {showRSI && rsiValues.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-1 mb-1 text-xs text-slate-500">
            <span>RSI (14)</span>
            <Tooltip content="RSI above 70 may indicate overbought conditions. Below 30 may indicate oversold. Neither is a guarantee — always use with other analysis." />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-100 rounded-full relative">
              <div className="absolute inset-0 flex">
                <div className="w-[30%] h-full bg-emerald-100 rounded-l-full" />
                <div className="w-[40%] h-full bg-slate-100" />
                <div className="w-[30%] h-full bg-red-100 rounded-r-full" />
              </div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow"
                style={{ left: `calc(${rsiValues[rsiValues.length - 1]}% - 6px)` }}
              />
            </div>
            <span className={`text-xs font-semibold w-8 text-right ${
              rsiValues[rsiValues.length - 1] > 70
                ? 'text-red-500'
                : rsiValues[rsiValues.length - 1] < 30
                ? 'text-emerald-600'
                : 'text-slate-600'
            }`}>
              {rsiValues[rsiValues.length - 1].toFixed(0)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-slate-300 mt-0.5">
            <span>Oversold</span>
            <span>Neutral</span>
            <span>Overbought</span>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 mt-3 leading-relaxed">{asset.description}</p>
    </div>
  );
}

export function TradingPage() {
  const { user, selectedAsset, setSelectedAsset, prices } = useStore();
  const [activeClass, setActiveClass] = useState<AssetClass>('stocks');
  const [search, setSearch] = useState('');

  const filteredAssets = ASSETS.filter(a =>
    a.assetClass === activeClass &&
    (a.symbol.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase()))
  );

  const unlockedClasses = ASSET_CLASS_TABS.filter(t => isAssetClassUnlocked(t.id, user.level));
  const lockedClasses = ASSET_CLASS_TABS.filter(t => !isAssetClassUnlocked(t.id, user.level));

  return (
    <div className="flex h-full min-h-0">
      {/* Left panel: Asset browser */}
      <div className="w-56 flex-shrink-0 border-r border-slate-100 bg-white flex flex-col">
        <div className="p-3 border-b border-slate-100">
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Asset class tabs */}
        <div className="flex flex-wrap gap-1 p-2 border-b border-slate-100">
          {unlockedClasses.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveClass(tab.id); setSearch(''); }}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                activeClass === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
          {lockedClasses.map(tab => (
            <button
              key={tab.id}
              disabled
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium opacity-40 cursor-not-allowed"
              title={`Unlocks at ${tab.id === 'forex' ? 'Trader' : tab.id === 'options' ? 'Analyst' : 'Pro'} level`}
            >
              🔒 {tab.label}
            </button>
          ))}
        </div>

        {/* Asset list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filteredAssets.map(asset => (
            <AssetRow
              key={asset.symbol}
              asset={asset}
              onSelect={() => setSelectedAsset(asset)}
              isSelected={selectedAsset?.symbol === asset.symbol}
            />
          ))}
        </div>
      </div>

      {/* Right panel: Chart + Order entry */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedAsset ? (
          <div className="grid xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2 space-y-4">
              <PriceChart asset={selectedAsset} />
            </div>
            <div>
              <OrderEntry asset={selectedAsset} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-64 text-center">
            <p className="text-4xl mb-4">📈</p>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">Select an Asset to Trade</h2>
            <p className="text-sm text-slate-400 max-w-sm">
              Choose a stock from the left panel to view its price chart and place orders.
              {!isAssetClassUnlocked('forex', user.level) && (
                <span> More asset classes unlock as you gain XP and level up!</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
