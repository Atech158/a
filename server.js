const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client, Databases } = require('appwrite');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Appwrite Configuration
const client = new Client();
const database = new Databases(client);

client
    .setEndpoint('https://YOUR-APPWRITE-ENDPOINT') // Replace with your Appwrite endpoint
    .setProject('YOUR_PROJECT_ID')                // Replace with your Appwrite project ID
    .setKey('YOUR_API_KEY');                      // Replace with your Appwrite API key

const DATABASE_ID = 'YOUR_DATABASE_ID'; // Replace with your database ID
const COLLECTION_ID = 'YOUR_COLLECTION_ID'; // Replace with your collection ID

// Endpoint to check username
app.post('/check-username', async (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('username', username)
        ]);

        if (response.documents.length > 0) {
            return res.json({ peerId: response.documents[0].peerId });
        } else {
            return res.json({ peerId: null });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Endpoint to register a Peer ID for a username
app.post('/register-peerid', async (req, res) => {
    const { username, peerId } = req.body;
    if (!username || !peerId) {
        return res.status(400).json({ error: 'Username and Peer ID are required' });
    }

    try {
        await database.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', {
            username: username,
            peerId: peerId
        });
        return res.json({ message: 'Peer ID registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
