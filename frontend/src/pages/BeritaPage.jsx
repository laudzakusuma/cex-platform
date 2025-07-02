import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './BeritaPage.module.css';

const BeritaPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/api/berita')
            .then(response => {
                setNews(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Gagal mengambil data berita:", error);
                setError("Tidak dapat memuat data berita. Pastikan server backend berjalan.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p className={styles.loadingText}>Memuat berita terkini...</p>;
    }

    if (error) {
        return <p className={styles.errorText}>{error}</p>;
    }

    return (
        <div>
            <h1 className={styles.pageTitle}>Berita Terkini</h1>
            <div className={styles.newsContainer}>
                {news.map(item => (
                    <article key={item.id} className={styles.newsItem}>
                        <h2 className={styles.newsTitle}>{item.title}</h2>
                        <p className={styles.newsMeta}>
                            <span>{item.source}</span> &bull; <span>{item.time}</span>
                        </p>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default BeritaPage;