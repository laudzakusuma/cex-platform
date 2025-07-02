const express = require('express');
const http = require('http');
const https = require('https');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const BINANCE_API = 'https://api.binance.com/api/v3';

// Konfigurasi untuk mengabaikan error sertifikat SSL
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Cache sederhana
const apiCache = new Map();
const CACHE_DURATION_MS = 60 * 1000;
const getFromCache = (key) => {
    const entry = apiCache.get(key);
    if (entry && (Date.now() - entry.timestamp < CACHE_DURATION_MS)) {
        console.log(`[Cache] HIT: Mengambil data dari cache untuk: ${key}`);
        return entry.data;
    }
    console.log(`[Cache] MISS: Tidak ada cache valid untuk: ${key}`);
    return null;
};
const setToCache = (key, data) => {
    apiCache.set(key, { timestamp: Date.now(), data });
};

// Peta informasi koin
const coinInfoMap = {
    'BTC': { name: 'Bitcoin', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
    'ETH': { name: 'Ethereum', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
    'BNB': { name: 'BNB', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png' },
    'SOL': { name: 'Solana', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' },
    'XRP': { name: 'XRP', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png' },
    'DOGE': { name: 'Dogecoin', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png' },
    'ADA': { name: 'Cardano', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png' },
    'AVAX': { name: 'Avalanche', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png' },
    'SHIB': { name: 'Shiba Inu', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png' },
    'DOT': { name: 'Polkadot', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png' },
};

// Rute: Mendapatkan daftar koin dari Binance
app.get('/api/market/coins', async (req, res) => {
    const url = `${BINANCE_API}/ticker/24hr`;
    const cachedData = getFromCache(url);
    if (cachedData) return res.json(cachedData);

    try {
        console.log(`[API] REQUEST: Meminta daftar koin dari Binance.`);
        const response = await axios.get(url, { httpsAgent });
        
        const formattedData = response.data
            .filter(d => d.symbol.endsWith('USDT') && coinInfoMap[d.symbol.replace('USDT', '')])
            .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
            .slice(0, 15)
            .map(d => {
                const baseAsset = d.symbol.replace('USDT', '');
                const info = coinInfoMap[baseAsset];
                return {
                    id: d.symbol,
                    symbol: baseAsset,
                    name: info.name,
                    image: info.image,
                    current_price: parseFloat(d.lastPrice),
                    price_change_percentage_24h: parseFloat(d.priceChangePercent),
                };
            });

        setToCache(url, formattedData);
        console.log(`[API] SUCCESS: Berhasil mendapatkan dan memformat ${formattedData.length} koin.`);
        res.json(formattedData);
    } catch (error) {
        // --- BLOK PENANGANAN ERROR YANG DIPERBARUI ---
        if (axios.isAxiosError(error)) {
            // Menangkap error spesifik dari axios (seperti status code 4xx/5xx)
            console.error("[API] Axios Error:", error.response?.status, error.message);
        } else {
            // Menangkap error lain (seperti masalah jaringan, sertifikat, dll.)
            console.error("[API] Generic Error:", error.message);
        }
        res.status(500).json({ message: "Gagal mengambil daftar koin." });
    }
});

// Rute: Mendapatkan data grafik dari Binance
app.get('/api/market/chart/:pairSymbol', async (req, res) => {
    const { pairSymbol } = req.params;
    const url = `${BINANCE_API}/klines?symbol=${pairSymbol}&interval=1d&limit=100`;
    const cachedData = getFromCache(url);
    if (cachedData) return res.json(cachedData);
    
    try {
        console.log(`[API] REQUEST: Meminta data grafik untuk ${pairSymbol}.`);
        const response = await axios.get(url, { httpsAgent });
        const formattedData = response.data.map(d => ({
            time: d[0] / 1000,
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
        }));
        setToCache(url, formattedData);
        console.log(`[API] SUCCESS: Berhasil mendapatkan ${formattedData.length} titik data untuk ${pairSymbol}.`);
        res.json(formattedData);
    } catch (error) {
        // --- BLOK PENANGANAN ERROR YANG DIPERBARUI ---
        if (axios.isAxiosError(error)) {
            console.error(`[API] Axios Error untuk ${pairSymbol}:`, error.response?.status, error.message);
        } else {
            console.error(`[API] Generic Error untuk ${pairSymbol}:`, error.message);
        }
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
    console.log('Klien baru terhubung ke WebSocket');
    ws.on('message', (message) => {
        wss.clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(message.toString());
            }
        });
    });
    ws.on('close', () => console.log('Klien terputus'));
});

server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});