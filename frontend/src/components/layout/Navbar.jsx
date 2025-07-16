import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { account, connectWallet } = useWallet();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      alert('Gagal untuk logout');
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        {/* Navigasi Kiri */}
        <div className={styles.leftSection}>
          <NavLink to="/" className={styles.logo}><span>Nusa</span>X</NavLink>
          <nav className={styles.navLinks}>
            <NavLink to="/pasar" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Pasar</NavLink>
            <NavLink to="/chatroom" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Chatroom</NavLink>
            <NavLink to="/berita" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Berita</NavLink>
          </nav>
        </div>
        
        {/* Navigasi Kanan (Logika Baru) */}
        <div className={styles.rightSection}>
          {currentUser ? (
            <div className={styles.userInfo}>
              <span>{currentUser.email}</span>
              <button onClick={handleLogout} className={styles.authButton}>Logout</button>
            </div>
          ) : (
            <div className={styles.authActions}>
              <NavLink to="/login" className={styles.authButton}>Login</NavLink>
              <NavLink to="/register" className={`${styles.authButton} ${styles.primary}`}>Daftar</NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}