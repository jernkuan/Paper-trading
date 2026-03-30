import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  // Novice Lessons
  {
    id: 'what-is-paper-trading',
    title: 'What Is Paper Trading?',
    category: 'Getting Started',
    minLevel: 'novice',
    duration: '3 min',
    xpReward: 15,
    content: `Paper trading means practicing buying and selling investments using fake money. Think of it like a flight simulator for pilots — you get to experience real market conditions without any real risk.

The name comes from the old days when people would write down "hypothetical" trades on paper to practice without actually placing real orders. Today, paper trading apps simulate live market prices so you can learn exactly how trading works.

Why bother? Because trading has a learning curve. Most beginners lose money when they start with real cash simply because they haven't learned the mechanics yet. Paper trading lets you make all your early mistakes for free — and trust us, everyone makes mistakes at first. The goal here is to build confidence and skills before any real money is on the line.`,
  },
  {
    id: 'what-are-stocks',
    title: 'What Are Stocks?',
    category: 'Asset Classes',
    minLevel: 'novice',
    duration: '4 min',
    xpReward: 15,
    content: `A stock represents a small piece of ownership in a company. When you buy one share of Apple (AAPL), you literally own a tiny fraction of Apple Inc. — its buildings, products, future profits, everything.

Companies sell shares to raise money for growth. In exchange, shareholders get a share of the profits (called dividends) and a vote in major company decisions. More importantly, as the company becomes more valuable, your shares become worth more too — that's how investors make money.

Stock prices change every second because thousands of investors are constantly buying and selling based on news, earnings reports, and their expectations for the future. A company reports great earnings? Price likely goes up. Bad news? Price usually drops. Your job as a trader is to try to anticipate these movements — easier said than done!`,
  },
  {
    id: 'market-orders',
    title: 'Market Orders: Buy Now, Pay Later',
    category: 'Trading Mechanics',
    minLevel: 'novice',
    duration: '3 min',
    xpReward: 20,
    content: `A market order is the simplest type of order: you tell the broker "buy X shares right now at whatever the current price is." The trade executes almost instantly, which is great for speed.

The trade-off is price uncertainty. The price you see when you click "buy" might be slightly different from the price you actually pay. This difference is called slippage and is usually tiny (a few cents), but it can matter more with less liquid (harder to trade) assets.

When should you use a market order? When you care more about getting the trade done quickly than getting a specific price. For beginners, market orders are the easiest way to start — just know that the fill price might be slightly different from what you saw on screen.`,
  },
  {
    id: 'reading-portfolio',
    title: 'Reading Your Portfolio',
    category: 'Portfolio Management',
    minLevel: 'novice',
    duration: '4 min',
    xpReward: 15,
    content: `Your portfolio is a snapshot of everything you own. Here's how to read the key numbers:

**Total Value** = Cash Balance + Market Value of all your holdings. This is your bottom line.

**P&L (Profit & Loss)** = How much money you've made or lost compared to what you paid. A positive P&L means you're up; negative means you're down. It's shown both in dollars ($) and as a percentage (%).

**Cost Basis** = The average price you paid for a stock. If you bought 10 shares of AAPL at $180 and another 10 at $200, your average cost basis is $190. If the current price is $195, you're slightly profitable.

Don't obsess over daily fluctuations. A stock being down 1% today means almost nothing for its long-term value. Successful investors focus on the big picture, not the day-to-day noise.`,
  },
  {
    id: 'bid-ask-spread',
    title: 'The Bid-Ask Spread Explained',
    category: 'Trading Mechanics',
    minLevel: 'novice',
    duration: '3 min',
    xpReward: 20,
    content: `Ever notice that stocks show two prices — a slightly higher "ask" and a slightly lower "bid"? That gap is called the spread, and it's one of the hidden costs of trading.

The **bid price** is the highest price a buyer is currently willing to pay. The **ask price** is the lowest price a seller is currently willing to accept. When you buy a stock, you pay the ask price. When you sell, you receive the bid price. The difference goes to the market makers who facilitate trades.

For popular stocks like Apple, the spread might be just $0.01. For less popular assets, it could be much wider. This is why trading high-volume, popular assets is generally cheaper. Next time you place a trade, notice the spread — it's a small but real cost on every single trade you make.`,
  },

  // Apprentice Lessons
  {
    id: 'limit-orders',
    title: 'Limit Orders: Set Your Price',
    category: 'Trading Mechanics',
    minLevel: 'apprentice',
    duration: '4 min',
    xpReward: 25,
    content: `A limit order lets you name your price. Instead of buying at whatever the market offers, you set the maximum price you're willing to pay (for a buy) or the minimum price you'll accept (for a sell).

For example: AAPL is trading at $190, but you only want to buy if it dips to $185. You place a buy limit order at $185. The order sits waiting, and only executes if the price hits $185 or lower. If the price never drops that low, the order stays pending.

Limit orders give you price control but not execution certainty. The risk: the stock might never reach your limit price, and you miss the trade. Or the price briefly touches your limit, fills partially, then shoots up without you. Limit orders are best when you're patient and have a specific entry price in mind — not when you urgently need to get into a position.`,
  },
  {
    id: 'reading-charts',
    title: 'Reading Price Charts',
    category: 'Market Analysis',
    minLevel: 'apprentice',
    duration: '5 min',
    xpReward: 25,
    content: `Price charts are the language of trading. A line chart simply plots closing prices over time — easy to read, good for seeing the big picture trend. Is the line going up (uptrend) or down (downtrend)?

The x-axis (horizontal) is time. The y-axis (vertical) is price. Every point on a line chart represents the closing price for that time period — one day, one hour, or one minute depending on the timeframe you choose.

Support and resistance are two concepts every chart reader needs: **Support** is a price level where a stock tends to stop falling and bounce back up — buyers step in at that level. **Resistance** is the opposite — a price level where selling tends to increase and the stock struggles to break above. When a stock breaks through resistance, it often surges. When it breaks support, it often drops further. Spotting these levels is one of the most useful basic skills in technical analysis.`,
  },
  {
    id: 'what-is-volatility',
    title: 'Understanding Volatility',
    category: 'Market Analysis',
    minLevel: 'apprentice',
    duration: '4 min',
    xpReward: 20,
    content: `Volatility measures how much a stock's price swings around. A volatile stock might move 5% in a single day. A low-volatility stock might only move 0.5%. Neither is inherently good or bad — they just suit different types of traders.

High volatility = higher potential gains AND higher potential losses. Tesla (TSLA) is notoriously volatile — exciting to trade, but you can lose money fast. Walmart (WMT) is low volatility — boring, but you're unlikely to see massive sudden drops either.

As a beginner, lower-volatility stocks are generally safer to practice with. You get the feel for trading without the stomach-churning swings. Once you're comfortable, you can gradually experiment with more volatile assets. A useful rule: never risk money you can't afford to lose on high-volatility instruments.`,
  },
  {
    id: 'stop-orders',
    title: 'Stop Orders: Your Safety Net',
    category: 'Trading Mechanics',
    minLevel: 'apprentice',
    duration: '4 min',
    xpReward: 25,
    content: `A stop order automatically triggers a trade when a price hits a certain level. The most common use is a **stop-loss**: you own a stock and want to automatically sell if it drops too much, limiting your losses.

Example: You bought AAPL at $190. You don't want to lose more than 5%, so you set a stop-loss at $180.50. If Apple drops to that price, your stop order becomes a market order and sells your shares automatically — even if you're asleep or away from your computer.

Stop orders are a crucial risk management tool. Without them, a bad trade can turn into a disaster if you're not watching. The downside: stop orders can get triggered by temporary dips, selling you out of a good position that quickly recovers. Some traders use "mental stops" (watching the price themselves) to avoid this, but for beginners, having a real stop order is usually better than none.`,
  },

  // Trader Lessons
  {
    id: 'forex-basics',
    title: 'Forex: Trading Currency Pairs',
    category: 'Asset Classes',
    minLevel: 'trader',
    duration: '5 min',
    xpReward: 30,
    content: `Forex (Foreign Exchange) is the world's largest financial market, with over $7 trillion traded every single day. You're trading one currency against another — for example, EUR/USD shows how many US dollars one Euro costs.

Currency prices are driven by factors like interest rates, inflation, economic growth, and political stability. If the US economy is doing well and the Federal Reserve raises interest rates, the dollar typically strengthens, causing EUR/USD to fall (you need fewer dollars to buy one Euro).

Forex pairs are quoted in "pips" — a pip is the smallest price movement. For EUR/USD, one pip is 0.0001 (one ten-thousandth of a dollar). Since individual moves are tiny, forex traders often use leverage to amplify gains — but leverage also amplifies losses. In this simulator, we trade without leverage so you can learn the mechanics safely first.`,
  },
  {
    id: 'rsi-indicator',
    title: 'RSI: Is a Stock Overbought?',
    category: 'Market Analysis',
    minLevel: 'trader',
    duration: '5 min',
    xpReward: 30,
    content: `The Relative Strength Index (RSI) is a momentum indicator that measures how fast and how much a price has been moving. It ranges from 0 to 100 and helps identify when a stock might be overbought (due for a pullback) or oversold (due for a bounce).

**RSI above 70**: The stock has risen a lot recently and may be "overbought" — potentially due for a pullback. Some traders use this as a sell signal.
**RSI below 30**: The stock has fallen sharply and may be "oversold" — potentially due for a recovery. Some traders see this as a buying opportunity.
**RSI around 50**: Neutral momentum, neither overbought nor oversold.

Important caveat: RSI is not a crystal ball. In a strong uptrend, RSI can stay above 70 for weeks while the stock keeps climbing. Always use RSI alongside other indicators and your overall analysis — never rely on any single indicator alone.`,
  },
  {
    id: 'position-sizing',
    title: 'Position Sizing: How Much to Buy?',
    category: 'Portfolio Management',
    minLevel: 'trader',
    duration: '5 min',
    xpReward: 35,
    content: `One of the most important decisions in trading isn't what to buy — it's how much to buy. Position sizing determines what percentage of your portfolio goes into each trade, and it's the cornerstone of risk management.

A common rule of thumb: never risk more than 1-2% of your total portfolio on a single trade. With a $10,000 portfolio, that means never risking more than $100-$200 per trade. This way, even a string of losses won't devastate your account.

To calculate position size, first decide your risk per trade (say $100), then figure out where you'd place your stop-loss (say, 5% below entry). Divide risk by stop distance: $100 ÷ 5% = $2,000 position size. This ensures that if your stop gets hit, you lose exactly what you planned.

Beginners often over-trade — putting too much money into individual ideas. Good position sizing protects you from any single bad bet sinking your portfolio.`,
  },
  {
    id: 'moving-averages',
    title: 'Moving Averages: Smoothing Out the Noise',
    category: 'Market Analysis',
    minLevel: 'trader',
    duration: '5 min',
    xpReward: 30,
    content: `A moving average smooths out price data by calculating the average price over a set period. A 20-day moving average (MA20) adds up the last 20 closing prices and divides by 20, updating daily. The result is a smooth line on your chart that filters out day-to-day noise.

**Two popular uses:**
1. **Trend direction**: If price is above the moving average, it's generally in an uptrend. Below it, a downtrend. Traders use this as a simple "are we bullish or bearish?" filter.
2. **Crossovers**: When a shorter MA (like 20-day) crosses above a longer MA (like 50-day), some traders see it as a buy signal — called a "golden cross." When the shorter crosses below the longer, it's called a "death cross" and can signal further selling.

Moving averages are lagging indicators — they describe what has happened, not what will happen. They're most useful in strongly trending markets and can give false signals when prices are choppy.`,
  },

  // Analyst Lessons
  {
    id: 'options-basics',
    title: 'Options: The Basics',
    category: 'Asset Classes',
    minLevel: 'analyst',
    duration: '7 min',
    xpReward: 50,
    content: `Options are contracts that give you the right (but not the obligation) to buy or sell a stock at a specific price before a specific date. They're more complex than stocks, but also more flexible.

A **call option** gives you the right to BUY shares at the "strike price." You'd buy a call if you think the stock will rise above that price.
A **put option** gives you the right to SELL shares at the strike price. You'd buy a put if you think the stock will fall below that price.

Options have an "expiration date" — after which they're worthless if unused. The price you pay for the option itself is called the "premium." If you buy a call option for $5 (premium) with a $190 strike on AAPL, you need AAPL to rise above $195 ($190 + $5 premium) just to break even.

Options can be used for speculation (betting on price moves) or hedging (protecting an existing stock position). For beginners, think of them as high-risk, high-reward instruments. In this simulator, we trade simplified options so you can understand the concepts without the full complexity.`,
  },
  {
    id: 'diversification',
    title: 'Diversification: Don\'t Put All Eggs in One Basket',
    category: 'Portfolio Management',
    minLevel: 'analyst',
    duration: '5 min',
    xpReward: 40,
    content: `Diversification is one of the most proven principles in investing: spreading your money across different assets reduces overall risk. If one stock crashes, a diversified portfolio absorbs the blow because other holdings may be doing fine or even rising.

True diversification means spreading across different industries (don't own 10 tech stocks), different asset classes (stocks, bonds, maybe commodities), and different geographies (US, international). If all your assets tend to move together, you're not truly diversified.

The concept of **correlation** matters here. Two assets that tend to move in the same direction are "positively correlated." When stocks fall, bonds often rise — they're "negatively correlated." A portfolio mixing stocks and bonds will be smoother and less volatile than an all-stock portfolio.

Diversification doesn't maximize returns — it optimizes the risk/return tradeoff. You might not have the biggest gains, but you're also protected from catastrophic loss.`,
  },
  {
    id: 'risk-reward',
    title: 'Risk/Reward Ratio: Is the Trade Worth It?',
    category: 'Portfolio Management',
    minLevel: 'analyst',
    duration: '5 min',
    xpReward: 40,
    content: `Before entering any trade, professional traders ask: "What's my potential gain vs. potential loss?" This is the risk/reward ratio. A 1:3 ratio means risking $1 to potentially make $3.

**How to calculate it:** Identify your entry price, your target (where you'll take profit), and your stop-loss (where you'll exit if wrong). Risk = Entry - Stop Loss. Reward = Target - Entry. Divide reward by risk.

For example: Buy AAPL at $190, stop-loss at $185, target at $205. Risk = $5, Reward = $15. Ratio = 3:1. That's a good trade setup on paper.

Most experienced traders won't take a trade with less than a 2:1 ratio — meaning the potential gain is at least twice the potential loss. Even if you're right only half the time, a consistent 2:1 ratio means you come out ahead in the long run. Risk/reward thinking is what separates disciplined traders from gamblers.`,
  },
  {
    id: 'technical-patterns',
    title: 'Classic Chart Patterns',
    category: 'Market Analysis',
    minLevel: 'analyst',
    duration: '6 min',
    xpReward: 45,
    content: `Chart patterns are recurring shapes in price history that some traders use to predict future moves. They're not perfect, but they reflect the psychology of buyers and sellers playing out over and over.

**Head and Shoulders**: A peak (the head) with two smaller peaks on either side (the shoulders). When the price breaks below the "neckline" connecting the two troughs, it often signals a downtrend reversal — historically reliable bearish signal.

**Double Bottom**: Two troughs at roughly the same price level, shaped like the letter "W." Signals that sellers couldn't push the price lower the second time — often a bullish reversal.

**Cup and Handle**: A rounded bottom (the cup) followed by a brief consolidation (the handle). Breakout above the handle resistance is often a powerful bullish signal.

**Flags and Pennants**: Brief consolidations after a sharp move. If the prior move was up, a bullish flag or pennant often continues upward. These are "continuation" patterns.

Remember: patterns work until they don't. Always use them with other context — no pattern works 100% of the time.`,
  },

  // Pro Lessons
  {
    id: 'bonds-and-etfs',
    title: 'Bonds and ETFs: Investing Fundamentals',
    category: 'Asset Classes',
    minLevel: 'pro',
    duration: '6 min',
    xpReward: 60,
    content: `Bonds and ETFs are the building blocks of long-term portfolio management — less exciting than individual stocks, but arguably more important for most investors.

A **bond** is a loan you make to a government or company. They promise to pay you regular interest (the "coupon") and return your principal when the bond matures. Bonds are generally safer than stocks because if a company goes bankrupt, bondholders get paid before stockholders. The trade-off: lower potential returns.

An **ETF (Exchange-Traded Fund)** holds a basket of assets — it could be hundreds of stocks, bonds, or even commodities — and trades on the stock exchange like a single stock. SPY, for example, holds all 500 S&P 500 stocks. Buying one share gives you instant diversification across 500 companies.

Together, bonds and ETFs form the foundation of most financial advisors' recommendations. A common starting portfolio: 60% broad stock ETF (like VTI), 40% bond ETF (like BND). This "60/40 portfolio" has historically delivered steady returns with manageable risk.`,
  },
  {
    id: 'portfolio-ratios',
    title: 'Portfolio Ratios: Measuring Performance',
    category: 'Financial Literacy',
    minLevel: 'pro',
    duration: '7 min',
    xpReward: 60,
    content: `Raw returns don't tell the full story. A 20% return sounds great, but if you took on massive risk to get it, was it worth it? Portfolio ratios help you evaluate performance in context.

**Sharpe Ratio**: Measures return per unit of risk. Formula: (Portfolio Return - Risk-Free Rate) ÷ Standard Deviation of Returns. Higher is better. A Sharpe ratio above 1 is considered good; above 2 is excellent. It tells you: "For each unit of risk I took, how much extra return did I earn?"

**Maximum Drawdown**: The largest peak-to-trough percentage decline in your portfolio. If your portfolio went from $10,000 to $7,500 at its worst point, your max drawdown is 25%. This tells you the worst case scenario you've experienced — important for understanding your emotional tolerance for loss.

**Win Rate vs. Profit Factor**: Win rate = percentage of trades that were profitable. Profit factor = total gains ÷ total losses. A 40% win rate can still be profitable if your average win is much larger than your average loss. Focus on profit factor, not just win rate.`,
  },
  {
    id: 'advanced-risk',
    title: 'Advanced Risk Management',
    category: 'Portfolio Management',
    minLevel: 'pro',
    duration: '7 min',
    xpReward: 75,
    content: `At the pro level, risk management becomes systematic and quantified. Here are the frameworks experienced traders use to protect their capital.

**The Kelly Criterion**: A mathematical formula to determine optimal position size based on your historical win rate and average win/loss size. It maximizes long-term growth while avoiding ruin. Full Kelly is aggressive; most professionals use "half Kelly" or less to reduce volatility.

**Correlation Management**: Don't just diversify across stocks — understand how correlated your positions are. During market crashes, correlations spike (everything falls together). Truly risk-aware portfolios include assets that zig when markets zag: gold, bonds, volatility products.

**Drawdown Rules**: Many professional funds have hard rules like: if the portfolio drops 10%, reduce all positions by 50%. If it drops 15%, go to cash. These rules prevent the emotional spiral where traders make bigger and bigger bets trying to recover losses — one of the most common ways traders blow up their accounts.

The goal of advanced risk management isn't to avoid losses — it's to ensure that no single event or series of events can permanently damage your ability to keep trading.`,
  },
];

export const LESSON_MAP: Record<string, Lesson> = Object.fromEntries(
  LESSONS.map(l => [l.id, l])
);
