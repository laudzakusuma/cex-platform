import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createApiUrl, ENDPOINTS } from '../config/api.js';
import styles from './BeritaPage.module.css';

const BeritaPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(createApiUrl(ENDPOINTS.NEWS), {
                    timeout: 10000
                });
                const filteredNews = response.data.filter(item => item.urlToImage && item.title);
                setNews(filteredNews);
                setLoading(false);
            } catch (error) {
                console.error("Gagal mengambil data berita:", error);
                const errorMessage = error.response?.data?.message || 
                    error.code === 'ECONNABORTED' ? "Request timeout. Server mungkin lambat." :
                    error.code === 'ECONNREFUSED' ? "Tidak dapat terhubung ke server. Pastikan backend berjalan." :
                    "Tidak dapat memuat data berita. Silakan coba lagi.";
                setError(errorMessage);
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        return new Date(isoDate).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
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
                <p className={styles.loadingText}>Memuat berita terkini...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorText}>{error}</p>
                <button onClick={handleRetry} className={styles.retryButton}>
                    Coba Lagi
                </button>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Crypto News</h1>
                <p className={styles.pageSubtitle}>Berita terkini seputar dunia cryptocurrency</p>
            </div>
            <div className={styles.newsGrid}>
                {news.map((item, index) => (
                    <article key={index} className={styles.newsCard}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.newsLink}>
                            <div className={styles.imageContainer}>
                                <img 
                                    src={item.urlToImage} 
                                    alt={item.title} 
                                    className={styles.newsImage}
                                    loading="lazy"
                                />
                                <div className={styles.sourceLabel}>
                                    {item.source.name}
                                </div>
                            </div>
                            <div className={styles.cardContent}>
                                <h2 className={styles.newsTitle}>{item.title}</h2>
                                <p className={styles.newsDescription}>
                                    {item.description?.substring(0, 120)}...
                                </p>
                                <div className={styles.cardFooter}>
                                    <span className={styles.newsDate}>
                                        {formatDate(item.publishedAt)}
                                    </span>
                                </div>
                            </div>
                        </a>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default BeritaPage;