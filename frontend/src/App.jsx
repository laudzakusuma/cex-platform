import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import PasarPage from './pages/PasarPage';
import ChatroomPage from './pages/ChatroomPage';
import BeritaPage from './pages/BeritaPage';

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