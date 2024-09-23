function handlePostback(event) {
    const senderId = event.sender.id;
    const payload = event.postback.payload;

    // Gérer les postbacks ici
}

module.exports = { handlePostback };
