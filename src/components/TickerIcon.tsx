import { useState, useEffect } from 'react';
import { getSectorColor } from '../theme/colors';

interface TickerIconProps {
  ticker: string;
  sector?: string;
  className?: string;
}

export default function TickerIcon({ ticker, sector, className = '' }: TickerIconProps) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);

  useEffect(() => {
    // Try to load the ticker-specific SVG
    const loadImage = async () => {
      try {
        const module = await import(`../assets/${ticker}.svg`);
        setIconUrl(module.default);
      } catch (error) {
        setIconUrl(null);
      }
    };

    loadImage();
  }, [ticker]);

  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={ticker}
        className={`w-6 h-6 rounded-lg shrink-0 ${className}`}
      />
    );
  }

  // Fallback to colored box with first letter
  return (
    <div
      className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-semibold shrink-0 ${className}`}
      style={{ backgroundColor: sector ? getSectorColor(sector) : '#687D7A' }}
    >
      {ticker.charAt(0)}
    </div>
  );
}
