const fs = require('fs');
const path = require('path');

// Object pour stocker les commandes
let commands = {};

// Lire et charger tous les fichiers du répertoire "commands"
const commandsDir = path.join(__dirname, '../commands');
fs.readdirSync(commandsDir).forEach(file => {
    if (file.endsWith('.js')) {
        const command = require(path.join(commandsDir, file));
        // Utiliser le nom de la commande comme clé
        commands[command.config.name] = command;
    }
});

module.exports = async function handleMessage(userId, message, sendResponse) {
    // Vérifier si le message contient un nom de commande
    const commandName = message.split(' ')[0].toLowerCase(); // Extraction du premier mot du message comme commande
    const args = message.split(' ').slice(1).join(' '); // Extraction du reste comme arguments

    if (commands[commandName]) {
        // Si la commande existe, l'exécuter
        try {
            await commands[commandName].onStart(userId, args, sendResponse);
        } catch (error) {
            console.error(`Erreur lors de l'exécution de la commande ${commandName}:`, error.message);
            sendResponse("Une erreur est survenue lors de l'exécution de la commande.");
        }
    } else {
        // Si la commande n'existe pas, renvoyer un message d'erreur ou une réponse par défaut
        sendResponse("Commande non reconnue. Essayez 'help' pour voir la liste des commandes disponibles.");
    }
};
