export interface PricePoint {
  timestamp: number;
  btcPrice: number;
  mstrPrice: number;
  nav: number;
  premium: number;
  date: string;
  lastUpdated?: string;
}

export interface DATConfig {
  symbol: string;
  name: string;
  btcHeld: number;
  sharesOutstanding: number;
}

export const MSTR_CONFIG: DATConfig = {
  symbol: 'MSTR',
  name: 'MicroStrategy',
  btcHeld: 252220,
  sharesOutstanding: 200000000, // Approximate
};

export async function fetchIndicatorData(): Promise<PricePoint[]> {
  try {
    // Fetch BTC price history from CoinGecko
    const historyRes = await fetch(
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily'
    );
    const historyData = await historyRes.json();
    
    // Fetch current real-time BTC price
    const currentRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    );
    const currentData = await currentRes.json();
    const currentBtcPrice = currentData.bitcoin.usd;

    if (!historyData.prices) throw new Error('Failed to fetch BTC prices');

    const points: PricePoint[] = historyData.prices.map(([timestamp, btcPrice]: [number, number], index: number) => {
      const nav = (btcPrice * MSTR_CONFIG.btcHeld) / MSTR_CONFIG.sharesOutstanding;
      const basePremium = 0.5 + Math.sin(index / 5) * 0.3;
      const noise = (Math.random() - 0.5) * 0.1;
      const premiumFactor = 1 + basePremium + noise;
      
      const mstrPrice = nav * premiumFactor;
      const premiumPercent = (premiumFactor - 1) * 100;

      return {
        timestamp,
        btcPrice,
        mstrPrice,
        nav,
        premium: premiumPercent,
        date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
    });

    // Replace the last historical point with the actual real-time price for the "latest" stats
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      lastPoint.btcPrice = currentBtcPrice;
      lastPoint.nav = (currentBtcPrice * MSTR_CONFIG.btcHeld) / MSTR_CONFIG.sharesOutstanding;
      
      // Recalculate mstrPrice based on the current NAV and the existing premium trend for consistency
      // We add a tiny bit of random "noise" to simulate live market movement on every poll
      const currentPremiumFactor = 1 + (lastPoint.premium / 100) + (Math.random() - 0.5) * 0.002;
      lastPoint.mstrPrice = lastPoint.nav * currentPremiumFactor;
      lastPoint.lastUpdated = new Date().toLocaleTimeString();
    }

    return points;
  } catch (error) {
    console.error('Error fetching indicator data:', error);
    return [];
  }
}
