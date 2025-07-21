import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TradingViewWidget from '../components/TradingViewWidget.jsx';
import { createApiUrl, ENDPOINTS } from '../config/api.js';
import styles from './PasarPage.module.css';

const PasarPage = () => {
    const [coinList, setCoinList] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const response = await axios.get(createApiUrl(ENDPOINTS.COINS), {
                    timeout: 10000
                });
                setCoinList(response.data);
                if (response.data.length > 0) {
                    setSelectedCoin(response.data[0]);
                }
                setLoading(false);
            } catch (err) {
                console.error("Gagal memuat daftar koin:", err);
                const errorMessage = err.response?.data?.message || 
                    err.code === 'ECONNABORTED' ? "Request timeout. Server mungkin lambat." :
                    err.code === 'ECONNREFUSED' ? "Tidak dapat terhubung ke server. Pastikan backend berjalan." :
                    "Gagal memuat daftar koin. Silakan coba lagi.";
                setError(errorMessage);
                setLoading(false);
            }
        };

        fetchCoins();
    }, []);

    const formatCurrency = (number) => {
        if (number == null) return '$0.00';
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }).format(number);
    };

    const formatPercentage = (percent) => {
        if (percent == null) return '0.00%';
        return `${percent.toFixed(2)}%`;
    };

    const handleRetry = () => {
        setLoading(true);
        setError(null);
        window.location.reload();
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p className={styles.statusText}>Memuat pasar...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p className={`${styles.statusText} ${styles.errorText}`}>{error}</p>
                <button onClick={handleRetry} className={styles.retryButton}>
                    Coba Lagi
                </button>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Sidebar untuk daftar koin */}
            <div className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>Aset Cryptocurrency</h2>
                <div className={styles.coinsList}>
                    {coinList.map(coin => (
                        <div
                            key={coin.id}
                            className={`${styles.coinItem} ${selectedCoin?.id === coin.id ? styles.selected : ''}`}
                            onClick={() => setSelectedCoin(coin)}
                        >
                            <div className={styles.coinHeader}>
                                <img src={coin.image} alt={coin.name} className={styles.coinImage} />
                                <div className={styles.coinInfo}>
                                    <span className={styles.coinSymbol}>{coin.symbol.toUpperCase()}</span>
                                    <span className={styles.coinName}>{coin.name}</span>
                                </div>
                            </div>
                            <div className={styles.coinStats}>
                                <div className={styles.coinPrice}>
                                    {formatCurrency(coin.current_price)}
                                </div>
                                <div className={`${styles.coinChange} ${
                                    coin.price_change_percentage_24h >= 0 ? styles.positive : styles.negative
                                }`}>
                                    {formatPercentage(coin.price_change_percentage_24h)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Konten utama dengan grafik */}
            <div className={styles.mainContent}>
                {selectedCoin && (
                    <>
                        <div className={styles.chartHeader}>
                            <div className={styles.coinTitleSection}>
                                <img src={selectedCoin.image} alt={selectedCoin.name} className={styles.headerImage} />
                                <div>
                                    <h1 className={styles.chartTitle}>
                                        {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()}/USD)
                                    </h1>
                                    <div className={styles.priceInfo}>
                                        <span className={styles.currentPrice}>
                                            {formatCurrency(selectedCoin.current_price)}
                                        </span>
                                        <span className={`${styles.priceChange} ${
                                            selectedCoin.price_change_percentage_24h >= 0 ? styles.positive : styles.negative
                                        }`}>
                                            {formatPercentage(selectedCoin.price_change_percentage_24h)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.marketStats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Market Cap</span>
                                    <span className={styles.statValue}>
                                        {formatCurrency(selectedCoin.market_cap)}
                                    </span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Volume 24h</span>
                                    <span className={styles.statValue}>
                                        {formatCurrency(selectedCoin.total_volume)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Memanggil komponen widget dengan simbol yang dipilih */}
                        <div className={styles.chartWrapper}>
                           <TradingViewWidget symbol={selectedCoin.id} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PasarPage;