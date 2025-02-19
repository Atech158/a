// server.js
const express = require("express");
const cors = require("cors");
const { Client, Databases, Query, ID } = require("node-appwrite");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(cors());

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID;

/**
 * POST /get-peerid
 * Request Body: { "username": "user123", "peerId": "optional_newPeerId" }
 * 
 * - If the username exists in the collection, returns { peerId: existingPeerId }.
 * - If it does not exist, and if a "peerId" is provided in the request,
 *   creates a new document and returns { peerId: newPeerId }.
 */
app.post("/get-peerid", async (req, res) => {
  try {
    const { username, peerId } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    
    // Check if the user already exists
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("username", username)
    ]);

    if (result.documents.length > 0) {
      // Return the existing Peer ID
      return res.json({ peerId: result.documents[0].Peerid });
    }
    
    // If user does not exist, expect a peerId to be provided
    if (!peerId) {
      return res.status(400).json({ error: "User not found and no new Peer ID provided" });
    }
    
    // Create new document for the user
    const createResponse = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      { username, Peerid: peerId }
    );
    
    return res.json({ peerId: createResponse.Peerid || peerId });
  } catch (error) {
    console.error("Error saving peer ID:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
