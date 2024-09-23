const express = require('express');
const bodyParser = require('body-parser');
const { handleMessage } = require('./handles/handleMessage');
const { handlePostback } = require('./handles/handlePostback');

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN; // Assurez-vous que cette variable est définie dans votre environnement
const VERIFY_TOKEN = process.env.VERIFY_TOKEN; // Assurez-vous que cette variable est définie dans votre environnement

// Endpoint pour vérifier le webhook
app.get('/webhook', (req, res) => {
    const token = req.query['hub.verify_token'];
    if (token === VERIFY_TOKEN) {
        return res.status(200).send(req.query['hub.challenge']);
    }
    res.sendStatus(403);
});

// Endpoint pour recevoir les messages
app.post('/webhook', (req, res) => {
    const body = req.body;

    // Vérifier le type d'événement
    if (body.object === 'page') {
        body.entry.forEach(entry => {
            const webhookEvent = entry.messaging[0];
            handleMessage(webhookEvent);
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// Lancer le serveur
const PORT = process.env.PORT || 3000; // Assurez-vous que PORT est défini dans votre environnement
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
