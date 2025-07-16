import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TradingViewWidget from '../components/TradingViewWidget.jsx';
import styles from './PasarPage.module.css';

const PasarPage = () => {
    const [coinList, setCoinList] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [loading, setLoading] = useState(true);
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
                setError("Gagal memuat daftar koin. Pastikan server backend berjalan.");
                setLoading(false);
            });
    }, []);

    const formatCurrency = (number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);

    if (loading) return <p className={styles.statusText}>Memuat pasar...</p>;
    if (error) return <p className={`${styles.statusText} ${styles.errorText}`}>{error}</p>;

    return (
        <div className={styles.pageContainer}>
            {/* Sidebar untuk daftar koin */}
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

            {/* Konten utama dengan grafik */}
            <div className={styles.mainContent}>
                {selectedCoin && (
                    <>
                        <div className={styles.chartHeader}>
                            <img src={selectedCoin.image} alt={selectedCoin.name} className={styles.headerImage} />
                            <h1>{selectedCoin.name} ({selectedCoin.symbol.toUpperCase()}/USD)</h1>
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