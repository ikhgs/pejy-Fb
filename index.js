const express = require('express');
const bodyParser = require('body-parser');
const handleMessage = require('./handles/handleMessage');
const handlePostback = require('./handles/handlePostback');
const sendMessage = require('./handles/sendMessage');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'page') {
        body.entry.forEach(entry => {
            const webhook_event = entry.messaging[0];

            const senderId = webhook_event.sender.id;
            if (webhook_event.message) {
                const message = webhook_event.message.text || `image:${webhook_event.message.attachments[0].payload.url}`;
                handleMessage(senderId, message, (response) => sendMessage(senderId, response));
            } else if (webhook_event.postback) {
                const payload = webhook_event.postback.payload;
                handlePostback(senderId, payload, (response) => sendMessage(senderId, response));
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// Endpoint pour la validation du webhook
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
