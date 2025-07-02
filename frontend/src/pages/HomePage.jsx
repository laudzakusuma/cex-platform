import React from 'react';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.content}>
        <h1 className={styles.mainTitle}>
          Selamat Datang di <span className={styles.highlight}>NusaX</span>
        </h1>
        <p className={styles.subtitle}>
          Gerbang Anda menuju dunia aset digital. Aman, cepat, dan terpercaya.
        </p>
        <button className={styles.ctaButton}>
          Mulai Berdagang
        </button>
      </div>
    </div>
  );
};

export default HomePage;