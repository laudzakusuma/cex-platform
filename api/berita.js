import axios from 'axios';

export default async function handler(req, res) {
    const API_KEY = process.env.NEWS_API_KEY; 
    const query = 'crypto OR bitcoin OR ethereum';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=40&apiKey=${API_KEY}`;
    
    try {
        const response = await axios.get(url);

        res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate'); // Cache 15 menit
        
        res.status(200).json(response.data.articles);
    } catch (error) {
        console.error("Error fetching news from NewsAPI:", error.message);
        res.status(500).json({ message: "Gagal mengambil berita dari sumber eksternal." });
    }
}
