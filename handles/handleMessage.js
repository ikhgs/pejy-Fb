const { callGeminiAPI } = require('../commands/ai');
const { sendMessage } = require('./sendMessage');

async function handleMessage(event) {
    const senderId = event.sender.id;

    if (event.message && event.message.attachments) {
        // Vérifier si l'utilisateur a envoyé une image
        const imageUrl = event.message.attachments[0].payload.url;

        try {
            const responseMessage = await callGeminiAPI(imageUrl, senderId, "Voici une image que vous avez envoyée.");
            // Envoyer la réponse de l'API à l'utilisateur
            sendMessage(senderId, responseMessage);
        } catch (error) {
            sendMessage(senderId, "Désolé, une erreur est survenue lors du traitement de votre image.");
        }
    } else if (event.message && event.message.text) {
        // Gérer les messages texte ici si nécessaire
    }
}

module.exports = { handleMessage };
