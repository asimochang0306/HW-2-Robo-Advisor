# DAT.co Monitoring Platform Report

## Selected Indicator
**Indicator:** Premium to NAV (Net Asset Value)
**Company:** MicroStrategy (MSTR)

### Why this indicator?
Premium to NAV is the most critical metric for Digital Asset Treasury (DAT) companies. It represents the market's willingness to pay a premium (or discount) for a company's stock relative to the value of its underlying digital assets (primarily Bitcoin). For MSTR, this premium reflects its status as a "Bitcoin proxy" and the market's valuation of its aggressive leverage strategy.

## Relationship with Bitcoin (BTC)
MSTR's valuation is intrinsically tied to the price of Bitcoin because over 90% of its value is derived from its BTC holdings.
- **Correlation:** MSTR typically exhibits a high positive correlation with BTC.
- **Leverage Effect:** Due to its premium, MSTR often acts as a leveraged play on BTC. When BTC rises, the premium often expands as retail and institutional demand for the "proxy" increases.
- **Hypothesis:** A shrinking premium during a BTC price increase may indicate market exhaustion or the availability of alternative instruments (like Spot ETFs), while an expanding premium suggests high speculative demand for MSTR's specific treasury strategy.

## Deployed Website URL
[Live App URL](https://ais-dev-pa3abzvpa7jsx4uxwp4yib-444934039371.asia-east1.run.app)

## Implementation Details
- **Frontend:** React + Tailwind CSS
- **Visualization:** Recharts (Area and Line charts)
- **Data Source:** CoinGecko API (Real-time BTC Price) + Financial Modeling (MSTR NAV calculation)
- **Real-Time Engine:** Automated polling every 30 seconds to fetch live spot prices and update valuation metrics.
- **AI Integration:** Gemini 3 Flash for automated market interpretation.
- **Deployment:** Optimized for Vercel with `vercel.json` for SPA routing.
