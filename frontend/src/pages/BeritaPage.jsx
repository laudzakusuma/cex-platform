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
                const filteredNews = response.data.filter(item => item.urlToImage && item.title);
                setNews(filteredNews);
                setLoading(false);
            })
            .catch(error => {
                console.error("Gagal mengambil data berita:", error);
                const errorMessage = error.response?.data?.message || "Tidak dapat memuat data berita. Pastikan server backend berjalan dan kunci API benar.";
                setError(errorMessage);
                setLoading(false);
            });
    }, []);

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        return new Date(isoDate).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return <p className={styles.loadingText}>Memuat berita terkini...</p>;
    }

    if (error) {
        return <p className={styles.errorText}>{error}</p>;
    }

    return (
        <div>
            <h1 className={styles.pageTitle}>Berita Kripto Terkini</h1>
            <div className={styles.newsGrid}>
                {news.map((item, index) => (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" key={index} className={styles.newsCard}>
                        <img src={item.urlToImage} alt={item.title} className={styles.newsImage} />
                        <div className={styles.cardContent}>
                            <p className={styles.newsSource}>{item.source.name}</p>
                            <h2 className={styles.newsTitle}>{item.title}</h2>
                            <p className={styles.newsDate}>{formatDate(item.publishedAt)}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default BeritaPage;