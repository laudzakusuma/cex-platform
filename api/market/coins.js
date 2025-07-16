import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export default async function handler(req, res) {
    const url = `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false`;

    try {
        console.log(`[API] REQUEST: Meminta daftar koin dari CoinGecko.`);
        const response = await axios.get(url);
        console.log(`[API] SUCCESS: Berhasil mendapatkan ${response.data.length} koin.`);
        
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        
        res.status(200).json(response.data);
    } catch (error) {
        console.error("[API] ERROR saat mengambil daftar koin:", error.message);
        res.status(500).json({ message: "Gagal mengambil daftar koin." });
    }
}
