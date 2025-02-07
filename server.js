const express = require("express");
const cors = require("cors");
const { Client, Databases } = require("node-appwrite");

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Change to your Appwrite endpoint
  .setProject("YOUR_PROJECT_ID") // Your project ID
  .setKey("YOUR_API_KEY"); // Your API Key

const databases = new Databases(client);
const databaseId = "YOUR_DATABASE_ID";
const collectionId = "YOUR_COLLECTION_ID";

app.post("/get-peerid", async (req, res) => {
  const { username } = req.body;

  try {
    const response = await databases.listDocuments(databaseId, collectionId, [
      { key: "username", value: username, operator: "equal" },
    ]);

    if (response.documents.length > 0) {
      res.json({ peerId: response.documents[0].peerId });
    } else {
      res.json({ newUser: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/save-peerid", async (req, res) => {
  const { username, peerId } = req.body;

  try {
    await databases.createDocument(databaseId, collectionId, {
      username,
      peerId,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(10000, () => console.log("Server running on port 10000"));
