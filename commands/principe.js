const axios = require("axios");

// Dictionnaire pour stocker l'historique des conversations par utilisateur
let conversationHistory = {};
let imageCache = {}; // Stocker l'image temporairement par utilisateur

module.exports = {
    config: {
        name: "principe", // Nom de la commande
        author: "Bruno",
        version: "1.0.0",
        countDown: 5,
        role: 0,
        category: "Ai",
        shortDescription: {
            en: "Automatic Image/Text Response Bot"
        }
    },

    // Fonction principale déclenchée lors d'un message utilisateur
    onStart: async function (userId, prompt, sendResponse) {
        try {
            // Vérifier si le prompt est une image
            const isImage = prompt.startsWith("image:");
            if (isImage) {
                const imageUrl = prompt.split("image:")[1].trim();
                
                // Stocker l'image dans le cache pour une utilisation future dans la conversation
                imageCache[userId] = imageUrl;

                // Envoyer la requête à l'API avec l'image
                const response = await axios.post(`https://gemini-ap-espa-bruno.onrender.com/api/gemini`, {
                    prompt: "Traite l'image",
                    customId: userId,
                    link: imageUrl
                });

                // Stocker la réponse API dans l'historique des conversations
                conversationHistory[userId] = conversationHistory[userId] || { prompts: [], lastResponse: "" };
                conversationHistory[userId].prompts.push({ prompt: "Image reçue", link: imageUrl });
                conversationHistory[userId].lastResponse = response.data.message;

                // Répondre à l'utilisateur
                sendResponse(`✨ Photo reçue avec succès ! ✨\n${response.data.message}`);
                return;
            }

            // Si ce n'est pas une image, gérer comme un prompt textuel
            const encodedPrompt = encodeURIComponent(prompt);
            const apiUrl = `https://gemini-ap-espa-bruno.onrender.com/api/gemini?ask=${encodedPrompt}`;

            const response = await axios.get(apiUrl);

            // Si l'utilisateur demande des détails sur la photo après une image
            if (prompt.toLowerCase().includes("plus de détails") && imageCache[userId]) {
                // Utiliser l'image précédente pour répondre
                const imageResponse = await axios.post(`https://gemini-ap-espa-bruno.onrender.com/api/gemini`, {
                    prompt: "Donne-moi plus de détails sur cette image",
                    customId: userId,
                    link: imageCache[userId]
                });
                sendResponse(imageResponse.data.message || "Désolé, je ne peux pas fournir plus de détails.");
            } else if (response.data && response.data.message) {
                // Sinon, répondre normalement à la question textuelle
                sendResponse(response.data.message);
            } else {
                sendResponse("Impossible d'obtenir une réponse.");
            }
        } catch (error) {
            console.error('Erreur lors de la requête API:', error.message);
            sendResponse("Une erreur est survenue lors du traitement de votre requête.");
        }
    }
};
