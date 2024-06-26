# YouTube Live Stream Scraper

Este proyecto es una aplicación Node.js que realiza scraping de datos de YouTube para monitorear y almacenar información sobre transmisiones en vivo. Utiliza `axios` para realizar solicitudes HTTP, `cheerio` para extraer y manipular los datos del HTML y `mongoose` para almacenar los datos en una base de datos MongoDB.

## Características

- Realiza scraping de datos de YouTube para obtener información de transmisiones en vivo.
- Almacena los datos en una base de datos MongoDB.
- Proporciona una API REST para acceder a los datos recolectados.

## Requisitos

- Node.js (v14.0.0 o superior)
- MongoDB (local o en la nube, como MongoDB Atlas)

## Instalación

1. Clona el repositorio:
    ```sh
    git clone https://github.com/tu-usuario/youtube-live-stream-scraper.git
    cd youtube-live-stream-scraper
    ```

2. Instala las dependencias:
    ```sh
    npm install
    ```

3. Configura tu base de datos MongoDB. Asegúrate de que MongoDB esté en ejecución y crea un archivo `db.js` en el directorio raíz del proyecto si no existe:

    ```js
    const mongoose = require('mongoose');

    const connectDB = async () => {
        try {
            await mongoose.connect('mongodb://localhost:27017/youtube-scraper', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('MongoDB connected...');
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    };

    module.exports = connectDB;
    ```

## Uso

1. Inicia el servidor:
    ```sh
    npm start
    ```

2. Abre tu navegador y navega a `http://localhost:3000`. Deberías ver un JSON con la información del video de YouTube.

## Estructura del Proyecto

```plaintext
youtube-live-stream-scraper/
│
├── db.js                  # Configuración de la conexión a MongoDB
├── index.js               # Código principal de la aplicación
├── package.json           # Archivo de configuración de npm
├── package-lock.json      # Archivo de bloqueo de npm
└── README.md              # Documentación del proyecto

