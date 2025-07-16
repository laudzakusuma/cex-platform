import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { WalletProvider } from './context/WalletContext.jsx';
import Layout from './components/layout/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import PasarPage from './pages/PasarPage.jsx';
import ChatroomPage from './pages/ChatroomPage.jsx';
import BeritaPage from './pages/BeritaPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* Bungkus dengan AuthProvider */}
        <WalletProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="pasar" element={<PasarPage />} />
              {/* Lindungi rute chatroom di sini nanti */}
              <Route path="chatroom" element={<ChatroomPage />} />
              <Route path="berita" element={<BeritaPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
          </Routes>
        </WalletProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}