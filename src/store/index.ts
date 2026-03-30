import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User, Position, Order, Trade, JournalEntry, Achievement,
  PortfolioSnapshot, Asset, Notification, SkillLevel,
  getLevelFromXP, LEVEL_THRESHOLDS,
} from '../types';
import { ASSETS } from '../data/assets';
import { ACHIEVEMENTS } from '../data/achievements';
import { initializePrices } from '../utils/priceSimulator';

const STARTING_BALANCE = 10000;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getSlippage(): number {
  return 1 + (Math.random() * 0.002 + 0.0005) * (Math.random() < 0.5 ? 1 : -1);
}

interface AppState {
  // User
  user: User;
  setUserName: (name: string) => void;

  // Onboarding
  onboardingDone: boolean;
  completeOnboarding: (name: string) => void;

  // Prices
  prices: Record<string, number>;
  previousPrices: Record<string, number>;
  priceHistory: Record<string, number[]>;
  setPrices: (prices: Record<string, number>) => void;
  updatePrice: (symbol: string, price: number) => void;
  initPrices: () => void;

  // Portfolio
  positions: Position[];
  orders: Order[];
  trades: Trade[];
  portfolioSnapshots: PortfolioSnapshot[];

  // Trading
  placeOrder: (params: {
    asset: Asset;
    type: Order['type'];
    side: Order['side'];
    quantity: number;
    limitPrice?: number;
    stopPrice?: number;
    note?: string;
  }) => { success: boolean; message: string };
  cancelOrder: (orderId: string) => void;
  processLimitOrders: (currentPrices: Record<string, number>) => void;
  takeSnapshot: () => void;

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;

  // Achievements
  achievements: Achievement[];
  checkAchievements: () => void;

  // Lessons
  completedLessons: string[];
  completeLesson: (lessonId: string, xpReward: number) => void;

  // XP & leveling
  addXP: (amount: number, reason?: string) => void;

  // UI
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedAsset: Asset | null;
  setSelectedAsset: (asset: Asset | null) => void;
  showJournalPrompt: boolean;
  lastTradeId: string | null;
  dismissJournalPrompt: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (message: string, type: Notification['type']) => void;
  removeNotification: (id: string) => void;

  // Tracking for achievements
  tradeDays: string[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => {
      // Internal fill executor — not part of public interface
      function executeFill(order: Order, fillPrice: number, quantity: number) {
        const state = get();
        const { positions } = state;

        const filledOrder: Order = {
          ...order,
          status: 'filled',
          filledPrice: fillPrice,
          filledAt: new Date().toISOString(),
        };

        let pnl: number | undefined;

        if (order.side === 'buy') {
          const total = fillPrice * quantity;
          const existingPos = positions.find(p => p.symbol === order.symbol);

          let newPositions: Position[];
          if (existingPos) {
            const newQty = existingPos.quantity + quantity;
            const newAvgCost = (existingPos.avgCostBasis * existingPos.quantity + fillPrice * quantity) / newQty;
            newPositions = positions.map(p =>
              p.symbol === order.symbol
                ? { ...p, quantity: newQty, avgCostBasis: parseFloat(newAvgCost.toFixed(4)), currentPrice: fillPrice }
                : p
            );
          } else {
            const newPos: Position = {
              id: generateId(),
              symbol: order.symbol,
              assetClass: order.assetClass,
              name: order.name,
              quantity,
              avgCostBasis: fillPrice,
              currentPrice: fillPrice,
              previousClose: fillPrice,
              openDate: new Date().toISOString(),
            };
            newPositions = [...positions, newPos];
          }

          set(s => ({
            user: { ...s.user, cashBalance: s.user.cashBalance - total },
            positions: newPositions,
            orders: [...s.orders.filter(o => o.id !== order.id), filledOrder],
          }));
        } else {
          // Sell
          const total = fillPrice * quantity;
          const existingPos = positions.find(p => p.symbol === order.symbol);

          if (existingPos) {
            pnl = (fillPrice - existingPos.avgCostBasis) * quantity;
            const newQty = existingPos.quantity - quantity;

            let newPositions: Position[];
            if (newQty <= 0) {
              newPositions = positions.filter(p => p.symbol !== order.symbol);
            } else {
              newPositions = positions.map(p =>
                p.symbol === order.symbol ? { ...p, quantity: newQty } : p
              );
            }

            set(s => ({
              user: { ...s.user, cashBalance: s.user.cashBalance + total },
              positions: newPositions,
              orders: [...s.orders.filter(o => o.id !== order.id), filledOrder],
            }));
          }
        }

        const trade: Trade = {
          id: generateId(),
          symbol: order.symbol,
          assetClass: order.assetClass,
          name: order.name,
          side: order.side,
          quantity,
          price: fillPrice,
          total: fillPrice * quantity,
          timestamp: new Date().toISOString(),
          pnl,
        };

        const today = new Date().toISOString().split('T')[0];

        set(s => ({
          trades: [trade, ...s.trades],
          showJournalPrompt: true,
          lastTradeId: trade.id,
          tradeDays: s.tradeDays.includes(today) ? s.tradeDays : [...s.tradeDays, today],
        }));

        get().takeSnapshot();
        get().addXP(10, 'Trade placed');
        get().checkAchievements();
        get().addNotification(
          `${order.side === 'buy' ? 'Bought' : 'Sold'} ${quantity} × ${order.symbol} @ ${order.assetClass === 'forex' ? fillPrice.toFixed(4) : '$' + fillPrice.toFixed(2)}`,
          'success'
        );
      }

      return {
        user: {
          id: generateId(),
          name: '',
          level: 'novice',
          xp: 0,
          cashBalance: STARTING_BALANCE,
          startingBalance: STARTING_BALANCE,
          joinDate: new Date().toISOString(),
        },
        onboardingDone: false,
        prices: {},
        previousPrices: {},
        priceHistory: {},
        positions: [],
        orders: [],
        trades: [],
        portfolioSnapshots: [],
        journalEntries: [],
        achievements: ACHIEVEMENTS.map(a => ({ ...a })),
        completedLessons: [],
        activeTab: 'dashboard',
        selectedAsset: null,
        showJournalPrompt: false,
        lastTradeId: null,
        notifications: [],
        tradeDays: [],

        setUserName: (name) => set(s => ({ user: { ...s.user, name } })),

        completeOnboarding: (name) => {
          set(s => ({
            user: { ...s.user, name },
            onboardingDone: true,
          }));
          get().initPrices();
          get().takeSnapshot();
        },

        initPrices: () => {
          const existing = get().prices;
          if (Object.keys(existing).length === 0) {
            const initial = initializePrices(ASSETS);
            const history: Record<string, number[]> = {};
            for (const [symbol, price] of Object.entries(initial)) {
              history[symbol] = [price];
            }
            set({ prices: initial, previousPrices: initial, priceHistory: history });
          }
        },

        setPrices: (prices) => set({ prices }),

        updatePrice: (symbol, price) => {
          set(s => {
            const newPrices = { ...s.prices, [symbol]: price };
            const newHistory = {
              ...s.priceHistory,
              [symbol]: [...(s.priceHistory[symbol] ?? []), price].slice(-200),
            };
            return { prices: newPrices, priceHistory: newHistory };
          });
        },

        placeOrder: ({ asset, type, side, quantity, limitPrice, stopPrice, note }) => {
          const state = get();
          const { prices, positions, user } = state;
          const currentPrice = prices[asset.symbol] ?? asset.basePrice;

          if (quantity <= 0) {
            return { success: false, message: 'Quantity must be greater than zero.' };
          }

          const order: Order = {
            id: generateId(),
            symbol: asset.symbol,
            assetClass: asset.assetClass,
            name: asset.name,
            type,
            side,
            quantity,
            limitPrice,
            stopPrice,
            status: 'pending',
            createdAt: new Date().toISOString(),
            note,
          };

          if (type === 'market') {
            const slippage = getSlippage();
            const fillPrice = parseFloat((currentPrice * slippage).toFixed(4));
            const total = fillPrice * quantity;

            if (side === 'buy') {
              if (user.cashBalance < total) {
                return {
                  success: false,
                  message: `Insufficient cash. You need $${total.toFixed(2)} but only have $${user.cashBalance.toFixed(2)}.`,
                };
              }
              executeFill(order, fillPrice, quantity);
            } else {
              const position = positions.find(p => p.symbol === asset.symbol);
              if (!position || position.quantity < quantity) {
                return {
                  success: false,
                  message: `You don't have enough shares to sell. You own ${position?.quantity ?? 0} shares.`,
                };
              }
              executeFill(order, fillPrice, quantity);
            }
            return {
              success: true,
              message: `Order filled at ${fillPrice.toFixed(asset.assetClass === 'forex' ? 4 : 2)}`,
            };
          } else {
            // Limit or Stop — queue it
            set(s => ({ orders: [...s.orders, order] }));
            return {
              success: true,
              message: `${type === 'limit' ? 'Limit' : 'Stop'} order placed and waiting.`,
            };
          }
        },

        cancelOrder: (orderId) => {
          set(s => ({
            orders: s.orders.map(o =>
              o.id === orderId ? { ...o, status: 'cancelled' as const } : o
            ),
          }));
        },

        processLimitOrders: (currentPrices) => {
          const state = get();
          const pendingOrders = state.orders.filter(o => o.status === 'pending');
          if (pendingOrders.length === 0) return;

          for (const order of pendingOrders) {
            const price = currentPrices[order.symbol];
            if (!price) continue;

            let shouldFill = false;

            if (order.type === 'limit') {
              if (order.side === 'buy' && order.limitPrice && price <= order.limitPrice) {
                shouldFill = true;
              } else if (order.side === 'sell' && order.limitPrice && price >= order.limitPrice) {
                shouldFill = true;
              }
            } else if (order.type === 'stop') {
              if (order.side === 'sell' && order.stopPrice && price <= order.stopPrice) {
                shouldFill = true;
              } else if (order.side === 'buy' && order.stopPrice && price >= order.stopPrice) {
                shouldFill = true;
              }
            }

            if (shouldFill) {
              executeFill(order, price, order.quantity);
              if (order.type === 'stop' && order.side === 'sell') {
                const updated = get();
                const stopAch = updated.achievements.find(a => a.id === 'stop-hero' && !a.unlockedAt);
                if (stopAch) {
                  set(s => ({
                    achievements: s.achievements.map(a =>
                      a.id === 'stop-hero' ? { ...a, unlockedAt: new Date().toISOString() } : a
                    ),
                  }));
                  get().addXP(stopAch.xpReward, 'Achievement: Stop Loss Hero');
                  get().addNotification('Achievement unlocked: Stop Loss Hero! 🛡️', 'achievement');
                }
              }
              get().addNotification(
                `Limit/Stop order filled: ${order.side} ${order.quantity} ${order.symbol} @ $${price.toFixed(2)}`,
                'info'
              );
            }
          }
        },

        takeSnapshot: () => {
          const { user, positions, prices } = get();
          const investedValue = positions.reduce((sum, pos) => {
            const p = prices[pos.symbol] ?? pos.currentPrice;
            return sum + pos.quantity * p;
          }, 0);
          const totalValue = user.cashBalance + investedValue;
          const now = new Date().toISOString();

          set(s => ({
            portfolioSnapshots: [...s.portfolioSnapshots, {
              date: now,
              totalValue,
              cashBalance: user.cashBalance,
              investedValue,
            }].slice(-500),
          }));

          set(s => ({
            positions: s.positions.map(pos => ({
              ...pos,
              currentPrice: s.prices[pos.symbol] ?? pos.currentPrice,
            })),
          }));
        },

        addJournalEntry: (entry) => {
          const newEntry: JournalEntry = {
            ...entry,
            id: generateId(),
            createdAt: new Date().toISOString(),
          };
          set(s => ({ journalEntries: [newEntry, ...s.journalEntries] }));
          get().checkAchievements();
        },

        updateJournalEntry: (id, updates) => {
          set(s => ({
            journalEntries: s.journalEntries.map(e => e.id === id ? { ...e, ...updates } : e),
          }));
        },

        deleteJournalEntry: (id) => {
          set(s => ({ journalEntries: s.journalEntries.filter(e => e.id !== id) }));
        },

        checkAchievements: () => {
          const state = get();
          const {
            trades, positions, journalEntries, completedLessons,
            achievements, user, portfolioSnapshots, tradeDays,
          } = state;

          const unlock = (id: string) => {
            const ach = achievements.find(a => a.id === id && !a.unlockedAt);
            if (!ach) return;
            set(s => ({
              achievements: s.achievements.map(a =>
                a.id === id ? { ...a, unlockedAt: new Date().toISOString() } : a
              ),
            }));
            get().addXP(ach.xpReward, `Achievement: ${ach.title}`);
            get().addNotification(`Achievement unlocked: ${ach.title}! ${ach.icon}`, 'achievement');
          };

          if (trades.length >= 1) unlock('first-trade');

          const stockPositions = positions.filter(p => p.assetClass === 'stocks');
          if (stockPositions.length >= 3) unlock('diversified');

          const hasLimit = state.orders.some(o => o.type === 'limit');
          if (hasLimit) unlock('limit-setter');

          if (completedLessons.length >= 5) unlock('scholar');
          if (completedLessons.length >= 17) unlock('lesson-master');

          if (journalEntries.length >= 5) unlock('journal-keeper');
          if (trades.length >= 10) unlock('ten-trades');

          const totalValue = user.cashBalance + positions.reduce((sum, p) => {
            const price = state.prices[p.symbol] ?? p.currentPrice;
            return sum + p.quantity * price;
          }, 0);
          if (totalValue >= 12000) unlock('portfolio-12k');
          if (totalValue >= 15000) unlock('paper-champion');

          const profitableSells = trades.filter(t => t.side === 'sell' && t.pnl !== undefined && t.pnl > 0);
          for (const trade of profitableSells) {
            const cost = trade.total - (trade.pnl ?? 0);
            if (cost > 0 && ((trade.pnl ?? 0) / cost) >= 0.10) unlock('profit-taker');
            if (cost > 0 && ((trade.pnl ?? 0) / cost) >= 0.20) unlock('big-gainer');
          }

          if (trades.some(t => t.assetClass === 'forex')) unlock('forex-explorer');
          if (trades.some(t => t.assetClass === 'options')) unlock('options-curious');
          if (trades.some(t => t.assetClass === 'bonds_etfs')) unlock('etf-fan');

          const assetClassesTraded = new Set(trades.map(t => t.assetClass));
          if (assetClassesTraded.size >= 4) unlock('all-classes');

          if (tradeDays.length >= 7) unlock('week-warrior');

          for (const pos of positions) {
            const openDate = new Date(pos.openDate);
            const daysOpen = (Date.now() - openDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysOpen >= 30) {
              unlock('steady-hands');
              break;
            }
          }

          if (portfolioSnapshots.length >= 2) {
            const recent = portfolioSnapshots.slice(-50);
            let peak = recent[0].totalValue;
            let inDrawdown = false;
            for (const snap of recent) {
              if (snap.totalValue > peak) {
                if (inDrawdown) unlock('bounce-back');
                peak = snap.totalValue;
                inDrawdown = false;
              }
              const drop = peak > 0 ? (peak - snap.totalValue) / peak : 0;
              if (drop >= 0.02) {
                unlock('red-day-survivor');
                inDrawdown = true;
              }
            }
          }
        },

        completeLesson: (lessonId, xpReward) => {
          if (get().completedLessons.includes(lessonId)) return;
          set(s => ({ completedLessons: [...s.completedLessons, lessonId] }));
          get().addXP(xpReward, 'Lesson completed');
          get().addNotification(`Lesson complete! +${xpReward} XP earned.`, 'success');
          get().checkAchievements();
        },

        addXP: (amount) => {
          const { user } = get();
          const oldLevel = getLevelFromXP(user.xp);
          const newXP = user.xp + amount;
          const newLevel = getLevelFromXP(newXP);
          set(s => ({
            user: { ...s.user, xp: newXP, level: newLevel },
          }));
          if (newLevel !== oldLevel) {
            const levelNames: Record<SkillLevel, string> = {
              novice: 'Novice', apprentice: 'Apprentice', trader: 'Trader', analyst: 'Analyst', pro: 'Pro',
            };
            get().addNotification(
              `Level up! You're now a ${levelNames[newLevel]}! New features unlocked.`,
              'levelup'
            );
          }
        },

        setActiveTab: (tab) => set({ activeTab: tab }),

        setSelectedAsset: (asset) => set({ selectedAsset: asset }),

        dismissJournalPrompt: () => set({ showJournalPrompt: false }),

        addNotification: (message, type) => {
          const id = generateId();
          set(s => ({
            notifications: [...s.notifications, { id, message, type }],
          }));
          setTimeout(() => {
            set(s => ({ notifications: s.notifications.filter(n => n.id !== id) }));
          }, 5000);
        },

        removeNotification: (id) => {
          set(s => ({ notifications: s.notifications.filter(n => n.id !== id) }));
        },
      };
    },
    {
      name: 'paper-trading-store',
      partialize: (state) => ({
        user: state.user,
        onboardingDone: state.onboardingDone,
        prices: state.prices,
        previousPrices: state.previousPrices,
        priceHistory: state.priceHistory,
        positions: state.positions,
        orders: state.orders,
        trades: state.trades,
        portfolioSnapshots: state.portfolioSnapshots,
        journalEntries: state.journalEntries,
        achievements: state.achievements,
        completedLessons: state.completedLessons,
        tradeDays: state.tradeDays,
      }),
    }
  )
);
