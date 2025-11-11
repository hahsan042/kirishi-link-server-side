const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const port = 3000;

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

// MongoDB Connect + Server Start
client
  .connect()
  .then(() => {
    const database = client.db("kirishiLink");
    cropsCollection = database.collection("product");
    console.log(" MongoDB connected successfully!");

    app.listen(port, () => {
      console.log(` Server running on port ${port}`);
    });
  })
  .catch((err) => console.error("❌ Failed to connect to MongoDB", err));


// Get all crops
app.get("/crops", async (req, res) => {
  try {
    const crops = await cropsCollection.find({}).toArray();
    res.json(crops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch crops" });
  }
});

// Latest crops (Home page)
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

// Add new crop
app.post("/crops", async (req, res) => {
  try {
    const crop = req.body;
    const result = await cropsCollection.insertOne(crop);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add crop" });
  }
});

//Submit an interest
app.post("/crops/:id/interest", async (req, res) => {
  const { id } = req.params;
  const interest = { ...req.body, _id: new ObjectId(), status: "pending" };

  try {
    const crop = await cropsCollection.findOne({ _id: new ObjectId(id) });
    if (!crop) return res.status(404).json({ error: "Crop not found" });

    // 🚨 Check if requested quantity > available quantity
    if (interest.quantity > crop.quantity) {
      return res
        .status(400)
        .json({ error: "Requested quantity exceeds available stock." });
    }

    // ✅ If ok, save interest
    await cropsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { interests: interest } }
    );
    res.json(interest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit interest" });
  }
});




    //  Return updated interest object
    const updatedInterest = updatedInterests.find(
      (i) => String(i._id) === interestId
    );
    res.json(updatedInterest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update interest" });
  }
});

//  Get all interests sent by a user
app.get("/my-interests", async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    if (!userEmail)
      return res.status(400).json({ error: "userEmail is required" });

    const cropsWithInterests = await cropsCollection
      .find({ "interests.userEmail": userEmail })
      .toArray();

    const result = cropsWithInterests.map((crop) => ({
      _id: crop._id,
      name: crop.name,
      owner: crop.owner,
      interests: crop.interests.filter((i) => i.userEmail === userEmail),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user interests" });
  }
});

// Update crop (Edit)
app.put("/crops/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const result = await cropsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedData },
      { returnDocument: "after" }
    );
    res.json(result.value);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update crop" });
  }
});

// Delete crop
app.delete("/crops/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await cropsCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Crop deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete crop" });
  }
});
