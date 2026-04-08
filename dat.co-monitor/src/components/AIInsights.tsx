import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { PricePoint } from '../services/dataService';
import { Sparkles, Loader2 } from 'lucide-react';

interface Props {
  data: PricePoint[];
}

export const AIInsights: React.FC<Props> = ({ data }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    if (data.length === 0) return;
    
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const latest = data[data.length - 1];
      const start = data[0];
      const premiumChange = latest.premium - start.premium;
      
      const prompt = `
        Analyze the following financial data for MicroStrategy (MSTR), a Digital Asset Treasury (DAT) company.
        
        Current BTC Price: $${latest.btcPrice.toLocaleString()}
        Current MSTR Price: $${latest.mstrPrice.toLocaleString()}
        Current NAV (Net Asset Value): $${latest.nav.toLocaleString()}
        Current Premium to NAV: ${latest.premium.toFixed(2)}%
        
        Trend over last 30 days:
        Starting Premium: ${start.premium.toFixed(2)}%
        Ending Premium: ${latest.premium.toFixed(2)}%
        Premium Change: ${premiumChange.toFixed(2)}%
        
        Please provide a concise (2-3 sentences) summary of:
        1. The current valuation status (is it overvalued or undervalued relative to its BTC holdings?).
        2. The relationship between the premium trend and BTC price behavior.
        3. A brief hypothesis on what this indicates for investors.
        
        Keep it professional and technical.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInsight(response.text || 'Unable to generate insights at this time.');
    } catch (error) {
      console.error('Error generating AI insight:', error);
      setInsight('Error connecting to AI service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-300">AI Market Analysis</h3>
        </div>
        <button
          onClick={generateInsight}
          disabled={loading || data.length === 0}
          className="px-4 py-1.5 bg-zinc-100 text-zinc-900 text-xs font-bold rounded hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Generate Insights'}
        </button>
      </div>

      {insight ? (
        <div className="text-zinc-400 text-sm leading-relaxed font-sans border-l-2 border-amber-500/30 pl-4 py-1 italic">
          {insight}
        </div>
      ) : (
        <p className="text-zinc-500 text-xs font-mono">
          Click the button to analyze current market indicators using Gemini AI.
        </p>
      )}
    </div>
  );
};
