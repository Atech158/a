const express = require('express');
const cors = require('cors');
const { Client, Databases } = require('node-appwrite');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(cors());

// Appwrite client setup
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const databaseId = process.env.APPWRITE_DATABASE_ID;
const collectionId = process.env.APPWRITE_COLLECTION_ID;

// Check if user exists or create new one
app.post('/get-peerid', async (req, res) => {
    const { username, peerId } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const users = await databases.listDocuments(databaseId, collectionId, [
            { key: 'username', value: username }
        ]);

        if (users.total > 0) {
            return res.json({ peerId: users.documents[0].peerId });
        }

        if (!peerId) {
            return res.status(400).json({ error: 'Peer ID required for new users' });
        }

        await databases.createDocument(databaseId, collectionId, 'unique()', {
            username,
            peerId
        });

        res.json({ peerId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
