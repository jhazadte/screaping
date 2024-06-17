const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const connectDB = require('./db');
const mongoose = require('mongoose');
const moment = require('moment');

// Conectar a MongoDB
connectDB();

const app = express();
const PORT = 3000;

// Definir el esquema y el modelo de Mongoose
const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    views: Number,
    channelName: String,
    live: Boolean,
    timestamp: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);

app.get('/', async (req, res) => {
    try {
        const channelUrl = 'https://www.youtube.com/@todonoticias/streams';
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(channelUrl, { waitUntil: 'networkidle2' });

        const content = await page.content();
        const $ = cheerio.load(content);

        const videoElements = $('ytd-rich-grid-row');
        let videoDataList = [];

        for (let index = 0; index < videoElements.length; index++) {
            const element = videoElements[index];
            const title = $(element).find('#video-title').text().trim();
            const videoUrl = `https://www.youtube.com${$(element).find('#video-title-link').attr('href')}`;
            const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content');
            const channelName = $('meta[itemprop="author"]').attr('content') || $('link[itemprop="name"]').attr('content');

            // Verificar si el video está en directo
            const liveElement = $(element).find('.badge-shape-wiz__text').text().trim();

            let views = null;
            let live = false;

            if (liveElement.includes('EN VIVO')) {
                live = true;
                // Obtener la página del video para extraer el número de vistas en directo
                await page.goto(videoUrl, { waitUntil: 'networkidle2' });
                const videoContent = await page.content();
                const $$ = cheerio.load(videoContent);
                const viewsText = $$('span.view-count').text();
                views = parseInt(viewsText.replace(/[^\d]/g, ''), 10);
            }

            const videoData = {
                title,
                description,
                views,
                channelName,
                live,
                timestamp: moment().toISOString()
            };

            // Guardar los datos en MongoDB
            const video = new Video(videoData);
            //await video.save();
            videoDataList.push(videoData);
        }

        await browser.close();

        res.json(videoDataList);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al hacer el scraping');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
