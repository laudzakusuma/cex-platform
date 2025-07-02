import React, { useState, useEffect, Suspense, useRef } from 'react';
import axios from 'axios';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cylinder } from '@react-three/drei';
import styles from './PasarPage.module.css';

const Coin3D = () => {
    const ref = useRef();
    useFrame((state, delta) => (ref.current.rotation.y += delta * 0.5));

    return (
        <group ref={ref} scale={0.6}>
            <Cylinder args={[1, 1, 0.2, 32]}>
                <meshStandardMaterial color="#fbbF24" metalness={0.8} roughness={0.2} />
            </Cylinder>
            <Cylinder args={[0.8, 0.8, 0.21, 32]}>
                <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
            </Cylinder>
        </group>
    );
};

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
            <div className={styles.headerContainer}>
                <h1 className={styles.pageTitle}>Harga Pasar Terkini</h1>
                <div className={styles.canvasContainer}>
                    <Canvas camera={{ position: [0, 2, 4], fov: 50 }}>
                        <Suspense fallback={null}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[5, 5, 5]} intensity={1} />
                            <Coin3D />
                        </Suspense>
                    </Canvas>
                </div>
            </div>
            
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
                        {marketData.map((coin, index) => (
                            <tr 
                                key={coin.id} 
                                className={styles.animatedRow}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <td>
                                    <div className={styles.coinName}>
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