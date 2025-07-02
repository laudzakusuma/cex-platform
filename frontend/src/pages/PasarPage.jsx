import React, { useState, useEffect, useRef, memo } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import styles from './PasarPage.module.css';

// Komponen Grafik, dibungkus dengan React.memo untuk stabilitas maksimum.
// React.memo mencegah komponen ini dirender ulang jika props-nya tidak berubah.
const ChartComponent = memo(({ data, isLoading }) => {
    const chartContainerRef = useRef();
    const chartRef = useRef(null);
    const seriesRef = useRef(null);

    // Efek ini HANYA berjalan sekali untuk membuat dan membersihkan grafik.
    useEffect(() => {
        if (!chartContainerRef.current) return;

        // 1. Membuat instance grafik dan seri data
        chartRef.current = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 500,
            layout: { backgroundColor: '#1F2937', textColor: 'rgba(255, 255, 255, 0.9)' },
            grid: { vertLines: { color: '#374151' }, horzLines: { color: '#374151' } },
        });

        seriesRef.current = chartRef.current.addCandlestickSeries({
            upColor: '#4ADE80', downColor: '#F87171',
        });

        // 2. Menangani perubahan ukuran jendela
        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.resize(chartContainerRef.current.clientWidth, 500);
            }
        };
        window.addEventListener('resize', handleResize);

        // 3. Fungsi cleanup: Ini sangat penting untuk menghapus grafik saat komponen dilepas.
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []); // Dependensi kosong memastikan ini hanya berjalan sekali.

    // Efek terpisah yang HANYA bertugas memperbarui data pada grafik yang sudah ada.
    useEffect(() => {
        if (seriesRef.current) {
            seriesRef.current.setData(data || []); // Selalu berikan array, bahkan jika kosong.
            if (data && data.length > 0 && chartRef.current) {
                chartRef.current.timeScale().fitContent();
            }
        }
    }, [data]); // Efek ini hanya berjalan saat `data` berubah.

    return (
        <div className={styles.chartWrapper}>
            {isLoading && <div className={styles.chartOverlay}>Memuat data grafik...</div>}
            <div ref={chartContainerRef} className={styles.chartContainer} />
        </div>
    );
});


// Komponen Halaman Utama
const PasarPage = () => {
    const [coinList, setCoinList] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ambil daftar koin saat halaman pertama kali dimuat
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

    // Ambil data grafik setiap kali koin yang dipilih berubah
    useEffect(() => {
        if (!selectedCoin) return;
        
        let isMounted = true;
        setIsChartLoading(true);
        setChartData([]); // Kosongkan data lama untuk memicu pembaruan yang bersih

        axios.get(`http://localhost:3001/api/market/chart/${selectedCoin.id}`)
            .then(response => {
                if (isMounted) setChartData(response.data);
            })
            .catch(err => {
                if (isMounted) setError(`Gagal memuat data untuk ${selectedCoin.name}.`);
            })
            .finally(() => {
                if (isMounted) setIsChartLoading(false);
            });
        
        return () => { isMounted = false; };
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
                {/* Komponen ChartComponent yang stabil */}
                <ChartComponent data={chartData} isLoading={isChartLoading} />
            </div>
        </div>
    );
};

export default PasarPage;