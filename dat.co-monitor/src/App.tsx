import { useEffect, useState } from 'react';
import { fetchIndicatorData, PricePoint, MSTR_CONFIG } from './services/dataService';
import { IndicatorChart } from './components/IndicatorChart';
import { AIInsights } from './components/AIInsights';
import { TrendingUp, Activity, Database, Info } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const result = await fetchIndicatorData();
      if (result.length > 0) {
        setData(result);
      }
      setLoading(false);
    }
    
    loadData();
    
    // Poll every 30 seconds for real-time updates
    const interval = setInterval(loadData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const latest = data[data.length - 1];

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 font-sans selection:bg-amber-500/30">
      {/* Header */}
      <header className="border-bottom border-zinc-800 p-6 flex items-center justify-between bg-zinc-900/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <TrendingUp className="text-zinc-900 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">DAT.co Monitor</h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Digital Asset Treasury Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-mono text-zinc-400 uppercase tracking-widest hidden md:flex">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span>Live: {latest?.lastUpdated || 'Connecting...'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-3 h-3 text-blue-500" />
            <span>CoinGecko API</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="BTC Price" 
            value={latest ? `$${latest.btcPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '---'} 
            subValue="Market Value"
          />
          <StatCard 
            label="MSTR Price" 
            value={latest ? `$${latest.mstrPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '---'} 
            subValue="Market Price"
          />
          <StatCard 
            label="NAV per Share" 
            value={latest ? `$${latest.nav.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '---'} 
            subValue="Intrinsic BTC Value"
          />
          <StatCard 
            label="Premium to NAV" 
            value={latest ? `${latest.premium.toFixed(2)}%` : '---'} 
            subValue="Valuation Premium"
            highlight
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/20 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-semibold">{MSTR_CONFIG.name} ({MSTR_CONFIG.symbol}) Analysis</h2>
                  <p className="text-xs text-zinc-500 font-mono">30-Day Time Series Indicator</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] font-mono text-zinc-400">DAILY</span>
                  <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] font-mono text-zinc-400">USD</span>
                </div>
              </div>
              {loading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                    <span className="text-xs font-mono text-zinc-500">FETCHING FINANCIAL DATA...</span>
                  </div>
                </div>
              ) : (
                <IndicatorChart data={data} />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <AIInsights data={data} />
            
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-300">Indicator Info</h3>
              </div>
              <div className="space-y-4 text-xs text-zinc-400 leading-relaxed">
                <p>
                  <strong className="text-zinc-200">Premium to NAV:</strong> This indicator measures how much investors are willing to pay for a company's stock relative to the value of its underlying digital assets.
                </p>
                <p>
                  A high premium often suggests strong market demand or a "proxy" effect where investors use the stock as a regulated way to gain BTC exposure.
                </p>
                <div className="pt-4 border-t border-zinc-800">
                  <p className="font-mono text-[10px] text-zinc-500">
                    BTC Held: {MSTR_CONFIG.btcHeld.toLocaleString()} BTC<br />
                    Shares: {(MSTR_CONFIG.sharesOutstanding / 1000000).toFixed(0)}M
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800 p-8 mt-12 text-center">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">
          DAT.co Monitoring Platform • Built for Financial Analysis
        </p>
      </footer>
    </div>
  );
}

function StatCard({ label, value, subValue, highlight = false }: { label: string, value: string, subValue: string, highlight?: boolean }) {
  return (
    <div className={cn(
      "p-6 rounded-xl border transition-all duration-300",
      highlight ? "bg-amber-500/5 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.05)]" : "bg-zinc-900/20 border-zinc-800 hover:border-zinc-700"
    )}>
      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">{label}</p>
      <p className={cn("text-2xl font-bold tracking-tight", highlight ? "text-amber-500" : "text-zinc-100")}>{value}</p>
      <p className="text-[10px] font-mono text-zinc-600 mt-1">{subValue}</p>
    </div>
  );
}
