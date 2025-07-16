const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const apiCache = new Map();
const CACHE_DURATION_MS = 60 * 1000;

const getFromCache = (key) => {
    const entry = apiCache.get(key);
    if (entry && (Date.now() - entry.timestamp < CACHE_DURATION_MS)) {
        console.log(`[Cache] HIT: Mengambil data dari cache untuk: ${key.substring(0, 80)}...`);
        return entry.data;
    }
    console.log(`[Cache] MISS: Tidak ada cache valid untuk: ${key.substring(0, 80)}...`);
    return null;
};

const setToCache = (key, data) => {
    apiCache.set(key, { timestamp: Date.now(), data });
};

app.get('/api/market/coins', async (req, res) => {
    const url = `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false`;
    
    const cachedData = getFromCache(url);
    if (cachedData) return res.json(cachedData);

    try {
        console.log(`[API] REQUEST: Meminta daftar koin dari CoinGecko.`);
        const response = await axios.get(url);
        setToCache(url, response.data);
        console.log(`[API] SUCCESS: Berhasil mendapatkan ${response.data.length} koin.`);
        res.json(response.data);
    } catch (error) {
        console.error("[API] ERROR saat mengambil daftar koin:", error.message);
        res.status(500).json({ message: "Gagal mengambil daftar koin." });
    }
});

app.get('/api/market/chart/:coinId', async (req, res) => {
    const { coinId } = req.params;
    const url = `${COINGECKO_API}/coins/${coinId}/ohlc?vs_currency=usd&days=90`;
    
    const cachedData = getFromCache(url);
    if (cachedData) return res.json(cachedData);
    
    try {
        console.log(`[API] REQUEST: Meminta data grafik untuk ${coinId}.`);
        const response = await axios.get(url);
        const formattedData = response.data.map(d => ({
            time: d[0] / 1000, open: d[1], high: d[2], low: d[3], close: d[4],
        }));
        setToCache(url, formattedData);
        console.log(`[API] SUCCESS: Berhasil mendapatkan ${formattedData.length} titik data untuk ${coinId}.`);
        res.json(formattedData);
    } catch (error) {
        console.error(`[API] ERROR saat mengambil data grafik untuk ${coinId}:`, error.message);
        res.status(500).json({ message: "Gagal mengambil data grafik." });
    }
});

app.get('/api/berita', async (req, res) => {
    const API_KEY = '9cf3ebb90cd347f3a3e5d4db17b275ab';
    const query = 'crypto OR bitcoin OR ethereum';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=40&apiKey=${API_KEY}`;
    try {
        const response = await axios.get(url);
        res.json(response.data.articles);
    } catch (error) {
        console.error("Error fetching news from NewsAPI:", error.message);
        res.status(500).json({ message: "Gagal mengambil berita dari sumber eksternal." });
    }
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('[WebSocket] Klien baru terhubung.');

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message.toString());
            const messageData = { ...data, timestamp: admin.firestore.FieldValue.serverTimestamp() };
            
            const docRef = await messagesCollection.add(messageData);
            const savedDoc = await docRef.get();
            const finalMessage = savedDoc.data();

            wss.clients.forEach(client => {
                if (client.readyState === ws.OPEN) {
                    client.send(JSON.stringify(finalMessage));
                }
            });
        } catch (error) {
            console.error("[WebSocket] Gagal memproses atau menyimpan pesan:", error);
        }
    });

    ws.on('close', () => console.log('[WebSocket] Klien terputus.'));
});

server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});