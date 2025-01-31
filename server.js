const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client, Databases } = require('node-appwrite');

const app = express();
app.use(bodyParser.json());
app.use(cors());
// Add this route to handle GET requests to the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Express Server');
});


// Appwrite Configuration
const client = new Client();
const database = new Databases(client);

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject('677fdc5900244f39dda2')                // Replace with your Appwrite project ID
    .setKey('standard_6c7fe39fa1b8f69e8409e72e8dfb8a8f6035bb84941f7c928b1153cddf035b54ae58ebc07e2f04f3adfc041571bf7ddb641a055a8a4a359b7c2051640e85c5a43de6e15d13424ed6099298eb9e0e332c9dccf38c6018eb0f89b16509dd9d6e7b00d594e7f1b1574cca13ea9d9db5cec3784e1486f82b9e358661b34126034ae3');


const DATABASE_ID = '679cc0b000243bfc76f3'; // Replace with your database ID
const COLLECTION_ID = '679cc0c4000e25b3a20a'; // Replace with your collection ID

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
app.post('/savePeer', async (req, res) => {
    try {
        console.log("Received data:", req.body);  // Debugging line

        const { username, Peerid } = req.body;

        // Check if Peerid is missing
        if (!Peerid) {
            return res.status(400).json({ error: "Missing required attribute 'Peerid'" });
        }

        const response = await databases.createDocument(
            'DATABASE_ID',
            'COLLECTION_ID',
            'unique()',  // Unique ID generation
            { username, Peerid }
        );

        res.json(response);

    } catch (error) {
        console.error("Error saving peer ID:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
