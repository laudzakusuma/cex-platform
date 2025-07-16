import React, { useEffect, useRef, memo } from 'react';

const TradingViewWidget = ({ symbol }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !symbol) return;

    containerRef.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.type = "text/javascript";
    script.async = true;
    
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          width: "100%",
          height: "100%",
          symbol: symbol, 
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "id",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
        });
      }
    };
    
    containerRef.current.id = `tradingview-widget-container-${symbol}`;
    containerRef.current.appendChild(script);

    return () => {
        if (containerRef.current) {
            containerRef.current.innerHTML = '';
        }
    }
  }, [symbol]);

  return (
    <div 
        ref={containerRef} 
        style={{ height: "100%", width: "100%" }}
    />
  );
}

export default memo(TradingViewWidget);