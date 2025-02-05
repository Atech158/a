const express = require("express");
const cors = require("cors");
const { Client, Databases, Query, ID } = require("node-appwrite");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Appwrite Client Setup
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

// API to create a new room
app.post("/create-room", async (req, res) => {
    const { username, peerId } = req.body;
    const roomId = `room_${Date.now()}`; // Unique Room ID

    try {
        const existingRoom = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_COLLECTION_ID,
            [Query.equal("username", username)]
        );

        if (existingRoom.documents.length > 0) {
            return res.json({ success: true, roomId: existingRoom.documents[0].roomId });
        }

        await databases.createDocument(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_COLLECTION_ID,
            ID.unique(),
            { roomId, username, peerId }
        );

        res.json({ success: true, roomId });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ error: "Failed to create room" });
    }
});

// API to get the peer ID for a specific room
app.get("/get-peer/:roomId", async (req, res) => {
    const roomId = req.params.roomId;

    try {
        const room = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_COLLECTION_ID,
            [Query.equal("roomId", roomId)]
        );

        if (room.documents.length > 0) {
            res.json({ peerId: room.documents[0].peerId });
        } else {
            res.status(404).json({ error: "Room not found" });
        }
    } catch (error) {
        console.error("Error fetching peer ID:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

    console.log(`Server running on port ${PORT}`);
};
