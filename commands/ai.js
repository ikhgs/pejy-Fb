const axios = require('axios');

const API_URL = 'https://gemini-ap-espa-bruno.onrender.com/api/gemini';

async function callGeminiAPI(imageUrl, customId, prompt) {
    try {
        const response = await axios.post(API_URL, {
            link: imageUrl,
            customId: customId,
            prompt: prompt
        });
        return response.data.message;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw new Error('Failed to communicate with Gemini API');
    }
}

module.exports = { callGeminiAPI };
