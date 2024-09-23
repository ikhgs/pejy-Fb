const axios = require('axios');

module.exports = async function sendMessage(userId, message) {
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

    try {
        const response = await axios.post(`https://graph.facebook.com/v12.0/me/messages`, {
            recipient: { id: userId },
            message: { text: message }
        }, {
            params: { access_token: PAGE_ACCESS_TOKEN }
        });

        if (response.status === 200) {
            console.log('Message envoyé avec succès!');
        } else {
            console.error('Erreur lors de l\'envoi du message:', response.data);
        }
    } catch (error) {
        console.error('Erreur lors de la requête vers l\'API Messenger:', error.message);
    }
};
