import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const styles = {
    header: "header", navContainer: "navContainer", leftSection: "leftSection", logo: "logo", navLinks: "navLinks",
    navLink: "navLink", navLinkActive: "navLinkActive", connectButton: "connectButton", connectedButton: "connectedButton"
  };
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleConnectWallet = () => setIsWalletConnected(!isWalletConnected);

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
        <button onClick={handleConnectWallet} className={isWalletConnected ? styles.connectedButton : styles.connectButton}>
          {isWalletConnected ? 'Terhubung' : 'Hubungkan Dompet'}
        </button>
      </div>
    </header>
  );
};