module.exports = async function handleMessage(event) {
    const senderId = event.sender.id;
    const message = event.message;

    if (message.attachments) {
        // Si le message contient une pièce jointe (par exemple, une image)
        const imageUrl = message.attachments[0].payload.url;

        console.log(`Image reçue de l'utilisateur ${senderId}: ${imageUrl}`);

        // Appel à la commande `principe` pour traiter l'image
        const principe = require('../commands/principe');
        await principe.onStart(senderId, `image:${imageUrl}`, (response) => {
            sendMessage(senderId, response);
        });

        return;
    }

    // Si le message est du texte
    if (message.text) {
        const text = message.text.trim().toLowerCase();

        // Appel à la commande `principe` pour gérer un texte
        const principe = require('../commands/principe');
        await principe.onStart(senderId, text, (response) => {
            sendMessage(senderId, response);
        });

        return;
    }

    // Si aucun message valide n'est reçu
    sendMessage(senderId, "Commande non reconnue. Essayez 'help' pour voir la liste des commandes disponibles.");
};
