import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext.jsx';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { account, connectWallet, disconnectWallet } = useWallet();

  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <div className={styles.leftSection}>
          <NavLink to="/" className={styles.logo}>
            <span>Nusa</span>X
          </NavLink>
          <nav className={styles.navLinks}>
            <NavLink to="/pasar" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Pasar</NavLink>
            <NavLink to="/chatroom" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Chatroom</NavLink>
            <NavLink to="/berita" className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}>Berita</NavLink>
          </nav>
        </div>
        
        {/* Logika tombol yang diperbarui */}
        {account ? (
          <div className={styles.walletInfo}>
            <span className={styles.addressText}>{truncateAddress(account)}</span>
            <button onClick={disconnectWallet} className={styles.disconnectButton}>
              Putuskan
            </button>
          </div>
        ) : (
          <button onClick={connectWallet} className={styles.connectButton}>
            Hubungkan Dompet
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;