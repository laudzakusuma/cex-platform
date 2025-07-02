import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './PasarPage.module.css';

const PasarPage = () => {
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/api/pasar')
            .then(response => {
                setMarketData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Gagal mengambil data pasar:", error);
                setError("Tidak dapat memuat data pasar. Pastikan server backend berjalan.");
                setLoading(false);
            });
    }, []);

    const formatCurrency = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    if (loading) {
        return <p className={styles.loadingText}>Memuat data pasar...</p>;
    }

    if (error) {
        return <p className={styles.errorText}>{error}</p>;
    }

    return (
        <div>
            <h1 className={styles.pageTitle}>Harga Pasar Terkini</h1>
            <div className={styles.tableContainer}>
                <table className={styles.marketTable}>
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Harga Terakhir</th>
                            <th>Perubahan 24j</th>
                            <th>Tindakan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marketData.map(coin => (
                            <tr key={coin.id}>
                                <td>
                                    <div className={styles.coinName}>
                                        {/* Anda bisa menambahkan ikon di sini */}
                                        <span className={styles.coinSymbol}>{coin.symbol}</span>
                                        <span>{coin.name}</span>
                                    </div>
                                </td>
                                <td>{formatCurrency(coin.price)}</td>
                                <td>
                                    <span className={coin.change >= 0 ? styles.positiveChange : styles.negativeChange}>
                                        {coin.change > 0 ? '+' : ''}{coin.change.toFixed(2)}%
                                    </span>
                                </td>
                                <td>
                                    <button className={styles.tradeButton}>Perdagangkan</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PasarPage;
