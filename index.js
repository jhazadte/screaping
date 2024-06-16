const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
    try {
        const videoUrl = 'https://www.youtube.com/@todonoticias/streams';
        const response = await axios.get(videoUrl);
        const html = response.data;
        const $ = cheerio.load(html);

        // Obtener título del video
        const title = $('meta[name="title"]').attr('content') || $('title').text();

        // Obtener descripción del video
        const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content');

        // Obtener número de vistas del video
        const viewsText = $('meta[itemprop="interactionCount"]').attr('content');
        const views = viewsText ? parseInt(viewsText, 10) : null;

        // Obtener nombre del canal
        const channelName = $('meta[itemprop="author"]').attr('content') || $('link[itemprop="name"]').attr('content');

        const onlinve = $('meta[itemprop="author"]').attr('content') || $('link[itemprop="name"]').attr('content');

        console.log($('meta[itemprop="author"]'));

        const videoData = {
            title,
            description,
            views,
            channelName,
            onlinve
        };

        res.json(videoData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al hacer el scraping');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
