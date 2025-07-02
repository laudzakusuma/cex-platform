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

app.get('/api/market/coins', async (req, res) => {
    try {
        const url = `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching coin list from CoinGecko:", error.message);
        res.status(500).json({ message: "Gagal mengambil daftar koin." });
    }
});

app.get('/api/market/chart/:coinId', async (req, res) => {
    const { coinId } = req.params;
    try {
        const url = `${COINGECKO_API}/coins/${coinId}/ohlc?vs_currency=usd&days=90`;
        const response = await axios.get(url);

        const formattedData = response.data.map(d => ({
            time: d[0] / 1000,
            open: d[1],
            high: d[2],
            low: d[3],
            close: d[4],
        }));
        res.json(formattedData);
    } catch (error) {
        console.error(`Error fetching chart data for ${coinId}:`, error.message);
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