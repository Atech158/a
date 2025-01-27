const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Mock Database (Replace with a real database)
const users = {}; // e.g., { "john": "peer1234", "alice": "peer5678" }

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Allow cross-origin requests

// Endpoint to check username
app.post('/check-username', (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    if (users[username]) {
        return res.json({ peerId: users[username] });
    } else {
        return res.json({ peerId: null }); // Username not found
    }
});

// Endpoint to register a Peer ID for a username
app.post('/register-peerid', (req, res) => {
    const { username, peerId } = req.body;
    if (!username || !peerId) {
        return res.status(400).json({ error: 'Username and Peer ID are required' });
    }

    users[username] = peerId; // Save to mock database
    return res.json({ message: 'Peer ID registered successfully' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
