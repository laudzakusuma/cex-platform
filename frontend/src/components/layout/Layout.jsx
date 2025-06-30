import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
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