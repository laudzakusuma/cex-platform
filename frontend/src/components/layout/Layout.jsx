import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
// Dalam file terpisah, Anda akan menggunakan baris ini:
// import styles from './Layout.module.css';

const Layout = () => {
  // Mock styles object untuk demonstrasi satu file
  const styles = { layout: "layout", mainContent: "mainContent" };
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};