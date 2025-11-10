


const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const port = 3000;

// MongoDB URI
const uri = "mongodb+srv://kirishi-link:aIctiiro3ghFyRZK@cluster0.mvbamfj.mongodb.net/krishiLinkDB?retryWrites=true&w=majority";

// Create MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Middleware to parse JSON
app.use(express.json());

// GET all crops
app.get('/crops', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('kirishiLink'); // your database name
    const cropsCollection = database.collection('product'); // your collection name
    const crops = await cropsCollection.find({}).toArray(); // get all documents
    res.send(crops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch crops' });
  } finally {
   
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
