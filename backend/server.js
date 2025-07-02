const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/api/pasar', (req, res) => {
    res.json([
        { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 1120450123, change: 2.54 },
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 55890123, change: 1.89 },
        { id: 'solana', symbol: 'SOL', name: 'Solana', price: 2150456, change: -0.5 },
    ]);
});

app.get('/api/berita', async (req, res) => {
    const API_KEY = '9cf3ebb98cd347f3a3e5d4db17b275ab';

    const url = `https://newsapi.org/v2/everything?q=cryptocurrency&sortBy=publishedAt&language=id&apiKey=${API_KEY}`;

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
