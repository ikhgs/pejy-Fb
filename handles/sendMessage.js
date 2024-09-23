const axios = require('axios');

function sendMessage(recipientId, messageText) {
    const messageData = {
        recipient: { id: recipientId },
        message: { text: messageText }
    };

    axios.post('https://graph.facebook.com/v12.0/me/messages', messageData, {
        params: {
            access_token: process.env.FB_PAGE_ACCESS_TOKEN
        }
    })
    .then(response => {
        console.log('Message sent successfully:', response.data);
    })
    .catch(error => {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    });
}

module.exports = { sendMessage };
