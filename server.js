const express = require("express");
const cors = require("cors");
const { Client, Databases, Query, ID } = require("node-appwrite");

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Appwrite Client
const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")  // Your Appwrite endpoint
    .setProject("677fdc5900244f39dda2")               // Your Appwrite project ID
    .setKey("standard_6c7fe39fa1b8f69e8409e72e8dfb8a8f6035bb84941f7c928b1153cddf035b54ae58ebc07e2f04f3adfc041571bf7ddb641a055a8a4a359b7c2051640e85c5a43de6e15d13424ed6099298eb9e0e332c9dccf38c6018eb0f89b16509dd9d6e7b00d594e7f1b1574cca13ea9d9db5cec3784e1486f82b9e358661b34126034ae3");              // Your API Key (must have database permissions)

const databases = new Databases(client);

// Replace with your actual database and collection IDs
const DATABASE_ID = "679cc0b000243bfc76f3";
const COLLECTION_ID = "679cc0c4000e25b3a20a";

// Handle saving Peer ID
app.post("/savePeer", async (req, res) => {
    try {
        const { username, Peerid } = req.body;

        if (!username || !Peerid) {
            return res.status(400).json({ error: "Username and Peer ID are required" });
        }

        // **Step 1: Check if the username already exists**
        const existingUsers = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal("username", username)
        ]);

        if (existingUsers.documents.length > 0) {
            // Username exists, return the existing Peer ID
            return res.json({
                success: true,
                message: "Username already exists",
                Peerid: existingUsers.documents[0].Peerid
            });
        }

        // **Step 2: If username does not exist, create new document**
        const response = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(), 
            { username, Peerid }
        );

        res.json({ success: true, message: "New user created", data: response });
    } catch (error) {
        console.error("Error saving peer ID:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
