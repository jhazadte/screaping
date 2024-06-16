const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://www.youtube.com');
        const html = response.data;
        const $ = cheerio.load(html);

        // Ejemplo de scraping: obtener títulos de videos
        let videoTitles = [];
        $('a#video-title').each((index, element) => {
            videoTitles.push($(element).text());
        });

        res.json(videoTitles);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al hacer el scraping');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
