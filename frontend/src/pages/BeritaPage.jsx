import { useState, useEffect } from 'react';
import axios from 'axios';

const BeritaPage = () => {
    const styles = { pageTitle: "pageTitle", newsContainer: "newsContainer", newsItem: "newsItem", newsTitle: "newsTitle", newsMeta: "newsMeta"};
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3001/api/berita')
            .then(response => { setNews(response.data); setLoading(false); })
            .catch(error => { console.error("Error fetching news:", error); setLoading(false); });
    }, []);

    if (loading) return <p>Memuat berita...</p>;

    return (
        <div>
            <h1 className={styles.pageTitle}>Berita Terkini</h1>
            <div className={styles.newsContainer}>
                {news.map(item => (
                    <div key={item.id} className={styles.newsItem}>
                        <h2 className={styles.newsTitle}>{item.title}</h2>
                        <p className={styles.newsMeta}>{item.source} &bull; {item.time}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};