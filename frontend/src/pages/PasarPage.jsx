import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import styles from './PasarPage.module.css';

const ChartComponent = ({ data, isLoading }) => {
    const chartContainerRef = useRef();
    const chartRef = useRef();

    useEffect(() => {
        if (!chartContainerRef.current) return;

        chartRef.current = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 500,
            layout: { backgroundColor: '#1F2937', textColor: 'rgba(255, 255, 255, 0.9)' },
            grid: { vertLines: { color: '#374151' }, horzLines: { color: '#374151' } },
            crosshair: { mode: 0 },
            rightPriceScale: { borderColor: '#4B5563' },
            timeScale: { borderColor: '#4B5563' },
        });

        const candleSeries = chartRef.current.addCandlestickSeries({
            upColor: '#4ADE80', downColor: '#F87171', borderDownColor: '#F87171',
            borderUpColor: '#4ADE80', wickDownColor: '#F87171', wickUpColor: '#4ADE80',
        });

        if (data && data.length > 0) {
            candleSeries.setData(data);
            chartRef.current.timeScale().fitContent();
        }

        const handleResize = () => {
            chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chartRef.current.remove();
        };
    }, []);

    useEffect(() => {
        if (chartRef.current && data && data.length > 0) {
            const series = chartRef.current.serieses()[0];
            if (series) {
                series.setData(data);
                chartRef.current.timeScale().fitContent();
            }
        }
    }, [data]);

    return (
        <div className={styles.chartWrapper}>
            {isLoading && <div className={styles.chartOverlay}>Memuat data...</div>}
            <div ref={chartContainerRef} className={styles.chartContainer} />
        </div>
    );
};


const PasarPage = () => {
    const [coinList, setCoinList] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/api/market/coins')
            .then(response => {
                setCoinList(response.data);
                if (response.data.length > 0) {
                    setSelectedCoin(response.data[0]);
                }
                setLoading(false);
            })
            .catch(err => {
                setError("Gagal memuat daftar koin.");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!selectedCoin) return;

        setIsChartLoading(true);
        axios.get(`http://localhost:3001/api/market/chart/${selectedCoin.id}`)
            .then(response => {
                setChartData(response.data);
            })
            .catch(err => {
                setError(`Gagal memuat data untuk ${selectedCoin.name}.`);
            })
            .finally(() => {
                setIsChartLoading(false);
            });
    }, [selectedCoin]);

    const formatCurrency = (number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);

    if (loading) return <p className={styles.statusText}>Memuat pasar...</p>;
    if (error && !coinList.length) return <p className={`${styles.statusText} ${styles.errorText}`}>{error}</p>;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>Aset</h2>
                <ul>
                    {coinList.map(coin => (
                        <li 
                            key={coin.id} 
                            className={`${styles.coinItem} ${selectedCoin?.id === coin.id ? styles.selected : ''}`}
                            onClick={() => setSelectedCoin(coin)}
                        >
                            <img src={coin.image} alt={coin.name} className={styles.coinImage} />
                            <div className={styles.coinInfo}>
                                <span className={styles.coinSymbol}>{coin.symbol.toUpperCase()}</span>
                                <span className={styles.coinName}>{coin.name}</span>
                            </div>
                            <div className={styles.coinPrice}>
                                {formatCurrency(coin.current_price)}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.mainContent}>
                {selectedCoin && (
                    <div className={styles.chartHeader}>
                        <img src={selectedCoin.image} alt={selectedCoin.name} className={styles.headerImage} />
                        <h1>{selectedCoin.name} ({selectedCoin.symbol.toUpperCase()}/USD)</h1>
                    </div>
                )}
                <ChartComponent data={chartData} isLoading={isChartLoading} />
            </div>
        </div>
    );
};

export default PasarPage;