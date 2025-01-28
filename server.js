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
    .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject('677fdc5900244f39dda2')                // Replace with your Appwrite project ID
    .setKey('standard_bbda0294c8c0c23f176adaccfb4d560825b48f2fc0d702f01537bf4760ffd3d102e1fcc820059bf9320f6ce144917a551bf295c7cef5c1bd02467f4526aa23466b968c24208891c38474d96b51fd592faaad930bfcb2b5d560eca79118c784de145247b60d3df406ba84ced0b950384cecc786ca37c903d5c98d01f7858967e5');


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
