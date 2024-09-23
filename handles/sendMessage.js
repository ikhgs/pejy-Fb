const request = require('request');

function sendMessage(senderId, message) {
    const body = {
        recipient: { id: senderId },
        message: { text: message }
    };

    request({
        uri: 'https://graph.facebook.com/v12.0/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: body
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            console.log('Message envoyé avec succès !');
        } else {
            console.error('Erreur lors de l\'envoi du message:', error || body.error);
        }
    });
}

module.exports = sendMessage;
