const request = require('request');

function sendMessage(recipientId, messageText) {
    const messageData = {
        recipient: { id: recipientId },
        message: { text: messageText }
    };

    request({
        uri: 'https://graph.facebook.com/v12.0/me/messages',
        qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            console.log('Message sent successfully:', body);
        } else {
            console.error('Error sending message:', error || body);
        }
    });
}

module.exports = { sendMessage };
