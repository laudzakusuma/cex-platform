import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export default async function handler(req, res) {
    const { coinId } = req.query;
    const url = `${COINGECKO_API}/coins/${coinId}/ohlc?vs_currency=usd&days=90`;
    
    try {
        console.log(`[API] REQUEST: Meminta data grafik untuk ${coinId}.`);
        const response = await axios.get(url);
        const formattedData = response.data.map(d => ({
            time: d[0] / 1000, open: d[1], high: d[2], low: d[3], close: d[4],
        }));
        
        console.log(`[API] SUCCESS: Berhasil mendapatkan ${formattedData.length} titik data untuk ${coinId}.`);

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
        
        res.status(200).json(formattedData);
    } catch (error) {
        console.error(`[API] ERROR saat mengambil data grafik untuk ${coinId}:`, error.message);
        res.status(500).json({ message: "Gagal mengambil data grafik." });
    }
}
