// 🌾 KrishiLink Server
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const port = 3000;

// ✅ MongoDB URI
const uri =
  "mongodb+srv://kirishi-link:aIctiiro3ghFyRZK@cluster0.mvbamfj.mongodb.net/krishiLinkDB?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(cors());
app.use(express.json());

let cropsCollection;

// MongoDB Connect + Start Server
client
  .connect()
  .then(() => {
    const database = client.db("kirishiLink");
    cropsCollection = database.collection("product");
    console.log("MongoDB connected successfully!");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.error("❌ Failed to connect to MongoDB", err));

/* -------------------------------------------------------------------------- */
/*                               API ENDPOINTS                               */
/* -------------------------------------------------------------------------- */

// 🔹 Get all crops
app.get("/crops", async (req, res) => {
  try {
    const crops = await cropsCollection.find({}).toArray();
    res.json(crops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch crops" });
  }
});

// 🔹 Get latest crops (for home page)
app.get("/latest-crops", async (req, res) => {
  try {
    const latestCrops = await cropsCollection
      .find({})
      .sort({ _id: -1 })
      .limit(6)
      .toArray();
    res.json(latestCrops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch latest crops" });
  }
});

