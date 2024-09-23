module.exports = function handlePostback(userId, payload, sendResponse) {
    sendResponse(`Postback reçu avec le payload: ${payload}`);
};
