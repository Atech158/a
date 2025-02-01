const express = require("express");
const cors = require("cors");
const { Client, Databases } = require("node-appwrite");

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Initialize Appwrite Client
const client = new Client();
client
    .setEndpoint("https://cloud.appwrite.io/v1")  // Replace with your Appwrite URL
    .setProject("677fdc5900244f39dda2")  // Replace with your Appwrite Project ID
    .setKey("standard_6c7fe39fa1b8f69e8409e72e8dfb8a8f6035bb84941f7c928b1153cddf035b54ae58ebc07e2f04f3adfc041571bf7ddb641a055a8a4a359b7c2051640e85c5a43de6e15d13424ed6099298eb9e0e332c9dccf38c6018eb0f89b16509dd9d6e7b00d594e7f1b1574cca13ea9d9db5cec3784e1486f82b9e358661b34126034ae3");  // Replace with your API Key

// 🔹 Initialize Appwrite Database
const databases = new Databases(client);

// 🔹 Route to Save Peer ID
app.post("/savePeer", async (req, res) => {
    try {
        const { username, Peerid } = req.body;
        if (!username || !Peerid) {
            return res.status(400).json({ error: "Username and Peer ID are required" });
        }

        const databaseId = "679cc0b000243bfc76f3";  // Replace with your Database ID
        const collectionId = "679cc0c4000e25b3a20a";  // Replace with your Collection ID

        const response = await databases.createDocument(databaseId, collectionId, username, {
            Peerid: Peerid,
        });

        res.json({ success: true, data: response });
    } catch (error) {
        console.error("Error saving peer ID:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// 🔹 Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
