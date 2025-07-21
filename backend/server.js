import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// ES6 modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com', 'https://www.yourdomain.com']
        : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API Constants
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// News API endpoint
app.get('/api/berita', async (req, res) => {
    const API_KEY = process.env.NEWS_API_KEY; 
    
    if (!API_KEY) {
        return res.status(500).json({ 
            message: "NEWS_API_KEY tidak ditemukan di environment variables." 
        });
    }
    
    const query = 'crypto OR bitcoin OR ethereum';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=40&apiKey=${API_KEY}`;
    
    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'CryptoTradingApp/1.0'
            }
        });

        res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate');
        res.status(200).json(response.data.articles);
    } catch (error) {
        console.error("Error fetching news from NewsAPI:", error.message);
        res.status(500).json({ 
            message: "Gagal mengambil berita dari sumber eksternal.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Market coins endpoint
app.get('/api/market/coins', async (req, res) => {
    const url = `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false`;

    try {
        console.log(`[API] REQUEST: Meminta daftar koin dari CoinGecko.`);
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'CryptoTradingApp/1.0'
            }
        });
        
        console.log(`[API] SUCCESS: Berhasil mendapatkan ${response.data.length} koin.`);
        
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        res.status(200).json(response.data);
    } catch (error) {
        console.error("[API] ERROR saat mengambil daftar koin:", error.message);
        res.status(500).json({ 
            message: "Gagal mengambil daftar koin.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Chart data endpoint
app.get('/api/market/chart/:coinId', async (req, res) => {
    const { coinId } = req.params;
    const url = `${COINGECKO_API}/coins/${coinId}/ohlc?vs_currency=usd&days=90`;
    
    try {
        console.log(`[API] REQUEST: Meminta data grafik untuk ${coinId}.`);
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'CryptoTradingApp/1.0'
            }
        });
        
        const formattedData = response.data.map(d => ({
            time: d[0] / 1000, 
            open: d[1], 
            high: d[2], 
            low: d[3], 
            close: d[4],
        }));
        
        console.log(`[API] SUCCESS: Berhasil mendapatkan ${formattedData.length} titik data untuk ${coinId}.`);

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        res.status(200).json(formattedData);
    } catch (error) {
        console.error(`[API] ERROR saat mengambil data grafik untuk ${coinId}:`, error.message);
        res.status(500).json({ 
            message: "Gagal mengambil data grafik.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Serve React app for all other routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Create HTTP server
const server = createServer(app);

// WebSocket server for real-time chat
const wss = new WebSocketServer({ server });

const clients = new Set();

wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection established');
    clients.add(ws);
    
    // Send welcome message
    ws.send(JSON.stringify({
        type: 'system',
        message: 'Terhubung ke server chat',
        timestamp: new Date().toISOString()
    }));
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());
            
            // Broadcast message to all connected clients
            const broadcastMessage = {
                ...message,
                timestamp: new Date().toISOString()
            };
            
            clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify(broadcastMessage));
                }
            });
            
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Format pesan tidak valid',
                timestamp: new Date().toISOString()
            }));
        }
    });
    
    ws.on('close', () => {
        console.log('WebSocket connection closed');
        clients.delete(ws);
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server berjalan di port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend URL: http://localhost:${PORT}`);
    console.log(`📡 API URL: http://localhost:${PORT}/api`);
    console.log(`💬 WebSocket server aktif untuk real-time chat`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});