import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useStore } from '../../store';
import {
  formatCurrency, formatPercent, getPnLClass,
  calculatePositionPnL, calculateTotalPnL, calculateDayChange,
  calculateDrawdown,
} from '../../utils/calculations';
import { Tooltip } from '../common/Tooltip';
import { ASSET_CLASS_LABELS } from '../../types';

function StatCard({
  label, value, subvalue, subvalueClass, tooltip,
}: {
  label: string;
  value: string;
  subvalue?: string;
  subvalueClass?: string;
  tooltip?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
        <span>{label}</span>
        {tooltip && <Tooltip content={tooltip} />}
      </div>
      <p className="text-xl font-bold text-slate-800">{value}</p>
      {subvalue && <p className={`text-sm font-medium mt-0.5 ${subvalueClass ?? ''}`}>{subvalue}</p>}
    </div>
  );
}

export function Dashboard() {
  const { user, positions, prices, portfolioSnapshots, trades, orders } = useStore();

  const investedValue = positions.reduce((sum, pos) => {
    const p = prices[pos.symbol] ?? pos.currentPrice;
    return sum + pos.quantity * p;
  }, 0);
  const totalValue = user.cashBalance + investedValue;
  const totalReturn = totalValue - user.startingBalance;
  const totalReturnPct = (totalReturn / user.startingBalance) * 100;

  const pnl = calculateTotalPnL(positions, prices);
  const dayChange = calculateDayChange(positions, prices, user.cashBalance);
  const drawdown = calculateDrawdown(portfolioSnapshots);

  // Chart data — last 50 snapshots
  const chartData = portfolioSnapshots.slice(-50).map((snap, i) => ({
    i,
    value: parseFloat(snap.totalValue.toFixed(2)),
    date: new Date(snap.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const recentTrades = trades.slice(0, 5);

  const chartMin = chartData.length > 0
    ? Math.min(...chartData.map(d => d.value)) * 0.995
    : 9000;
  const chartMax = chartData.length > 0
    ? Math.max(...chartData.map(d => d.value)) * 1.005
    : 11000;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Portfolio Overview</h1>
        <p className="text-sm text-slate-400">Welcome back, {user.name}! Here's how you're doing.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Portfolio Value"
          value={formatCurrency(totalValue)}
          subvalue={`${formatPercent(totalReturnPct)} all time`}
          subvalueClass={getPnLClass(totalReturn)}
          tooltip="Your total value: cash + market value of all holdings."
        />
        <StatCard
          label="Cash Balance"
          value={formatCurrency(user.cashBalance)}
          subvalue="Available to trade"
          tooltip="Money you have available to buy more assets."
        />
        <StatCard
          label="Unrealized P&L"
          value={formatCurrency(pnl.absolute)}
          subvalue={formatPercent(pnl.percentage)}
          subvalueClass={getPnLClass(pnl.absolute)}
          tooltip="Profit or loss on your current open positions — not locked in until you sell."
        />
        <StatCard
          label="Today's Change"
          value={formatCurrency(dayChange.absolute)}
          subvalue={formatPercent(dayChange.percentage)}
          subvalueClass={getPnLClass(dayChange.absolute)}
          tooltip="How much your portfolio has changed since the last simulated day."
        />
      </div>

      {/* Portfolio chart */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-slate-800">Portfolio Performance</h2>
            <p className="text-xs text-slate-400">Value over time (updates every ~minute of sim time)</p>
          </div>
          {drawdown > 0 && (
            <div className="text-right">
              <p className="text-xs text-slate-400">Max Drawdown</p>
              <p className="text-sm font-semibold text-red-500">-{drawdown.toFixed(2)}%</p>
            </div>
          )}
        </div>
        {chartData.length < 2 ? (
          <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
            <div className="text-center">
              <p className="text-2xl mb-2">📊</p>
              <p>Make your first trade to start tracking performance!</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[chartMin, chartMax]}
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                width={50}
              />
              <RechartsTooltip
                formatter={(v: number) => [formatCurrency(v), 'Portfolio Value']}
                labelFormatter={(l) => l}
                contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }}
              />
              <ReferenceLine y={user.startingBalance} stroke="#94A3B8" strokeDasharray="4 4" strokeWidth={1} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Holdings */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <h2 className="font-semibold text-slate-800 mb-4">Holdings</h2>
          {positions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-2xl mb-2">💼</p>
              <p className="text-sm">No positions yet.</p>
              <p className="text-sm">Go to Trade to buy your first asset!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-400 border-b border-slate-50">
                    <th className="text-left pb-2">Symbol</th>
                    <th className="text-right pb-2">Qty</th>
                    <th className="text-right pb-2">Price</th>
                    <th className="text-right pb-2">Value</th>
                    <th className="text-right pb-2">P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {positions.map(pos => {
                    const cp = prices[pos.symbol] ?? pos.currentPrice;
                    const positionPnl = calculatePositionPnL(pos, cp);
                    return (
                      <tr key={pos.id} className="hover:bg-slate-50">
                        <td className="py-2">
                          <div>
                            <p className="font-semibold text-slate-800">{pos.symbol}</p>
                            <p className="text-xs text-slate-400">{ASSET_CLASS_LABELS[pos.assetClass]}</p>
                          </div>
                        </td>
                        <td className="text-right py-2 text-slate-600">{pos.quantity}</td>
                        <td className="text-right py-2 text-slate-600">{formatCurrency(cp)}</td>
                        <td className="text-right py-2 font-medium text-slate-800">
                          {formatCurrency(cp * pos.quantity)}
                        </td>
                        <td className={`text-right py-2 font-medium ${getPnLClass(positionPnl.absolute)}`}>
                          <div>
                            <p>{formatCurrency(positionPnl.absolute)}</p>
                            <p className="text-xs">{formatPercent(positionPnl.percentage)}</p>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Recent trades */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <h2 className="font-semibold text-slate-800 mb-4">Recent Trades</h2>
            {recentTrades.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No trades yet.</p>
            ) : (
              <div className="space-y-2">
                {recentTrades.map(trade => (
                  <div key={trade.id} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-12 text-center text-xs font-semibold py-0.5 rounded-full ${
                        trade.side === 'buy'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {trade.side.toUpperCase()}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{trade.symbol}</p>
                        <p className="text-xs text-slate-400">
                          {trade.quantity} @ {formatCurrency(trade.price)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700">{formatCurrency(trade.total)}</p>
                      {trade.pnl !== undefined && (
                        <p className={`text-xs ${getPnLClass(trade.pnl)}`}>
                          {formatCurrency(trade.pnl)} P&L
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending orders */}
          {pendingOrders.length > 0 && (
            <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
              <h2 className="font-semibold text-slate-800 mb-4">Pending Orders</h2>
              <div className="space-y-2">
                {pendingOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold ${order.side === 'buy' ? 'text-emerald-600' : 'text-red-500'}`}>
                          {order.side.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400">{order.type}</span>
                        <span className="text-sm font-medium text-slate-700">{order.symbol}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {order.quantity} shares
                        {order.limitPrice && ` @ $${order.limitPrice}`}
                        {order.stopPrice && ` stop $${order.stopPrice}`}
                      </p>
                    </div>
                    <button
                      onClick={() => useStore.getState().cancelOrder(order.id)}
                      className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Encouragement when no positions */}
          {positions.length === 0 && recentTrades.length === 0 && (
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <p className="text-sm font-semibold text-blue-800 mb-1">Ready to start? 🚀</p>
              <p className="text-sm text-blue-600">
                You have {formatCurrency(user.cashBalance)} in virtual cash. Head over to the
                Trade tab to place your first order! Start with a stock you recognize, like Apple or Microsoft.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
