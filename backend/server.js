const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = 3001;

app.get('/', (req, res) => {
  res.send('Server Backend CEX Berjalan!');
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});