import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import PasarPage from './pages/PasarPage.jsx';
import ChatroomPage from './pages/ChatroomPage.jsx';
import BeritaPage from './pages/BeritaPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="pasar" element={<PasarPage />} />
          <Route path="chatroom" element={<ChatroomPage />} />
          <Route path="berita" element={<BeritaPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
