const sendMessage = require('./sendMessage');
const principe = require('../commands/principe');

module.exports = async function handleMessage(event) {
    const entries = event.entry;

    entries.forEach(entry => {
        const messagingEvents = entry.messaging;

        messagingEvents.forEach(async (messageEvent) => {
            const senderId = messageEvent.sender.id;
            const message = messageEvent.message;

            if (message.attachments && message.attachments[0].type === 'image') {
                const imageUrl = message.attachments[0].payload.url;

                console.log(`Image reçue de l'utilisateur ${senderId}: ${imageUrl}`);

                await principe.onStart(senderId, imageUrl, (response) => {
                    sendMessage(senderId, response);
                });

                return;
            }

            if (message.text) {
                const text = message.text.trim();

                console.log(`Texte reçu de l'utilisateur ${senderId}: ${text}`);

                await principe.onStart(senderId, text, (response) => {
                    sendMessage(senderId, response);
                });

                return;
            }

            sendMessage(senderId, "Commande non reconnue.");
        });
    });
};
