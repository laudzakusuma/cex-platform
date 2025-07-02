const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const mockNews = [
    { id: 1, title: "Regulasi Kripto Baru Diumumkan oleh Pemerintah", source: "CryptoNews ID", time: "2 jam lalu" },
    { id: 2, title: "Ethereum 'Merge' Berikutnya Dijadwalkan Bulan Depan", source: "Blockchain Times", time: "5 jam lalu" },
    { id: 3, title: "Analisis Harga Bitcoin: Akankah Tembus Level Support?", source: "Analisa Kripto", time: "8 jam lalu" },
    { id: 4, title: "5 Altcoin Potensial untuk Dipantau Minggu Ini", source: "Coinvestasi", time: "1 hari lalu" },
];

app.get('/api/pasar', (req, res) => {
    res.json([
        { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 1120450123, change: 2.54 },
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 55890123, change: 1.89 },
        { id: 'solana', symbol: 'SOL', name: 'Solana', price: 2150456, change: -0.5 },
    ]);
});

app.get('/api/berita', (req, res) => {
    res.json(mockNews);
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
