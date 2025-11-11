// const cors = require('cors');
// const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

// const express = require('express');
// const app = express();
// const port = 3000;

// const uri = "mongodb+srv://kirishi-link:aIctiiro3ghFyRZK@cluster0.mvbamfj.mongodb.net/krishiLinkDB?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// app.use(cors());
// app.use(express.json());

// let cropsCollection;

// // Connect once when server starts
// async function startServer() {
//   try {
//     await client.connect();
//     console.log("MongoDB connected successfully!");
//     const database = client.db('kirishiLink'); // your database name
//     cropsCollection = database.collection('product'); // your collection name

//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   } catch (err) {
//     console.error("Failed to connect to MongoDB", err);
//   }
// }

// startServer();

// // GET all crops
// app.get('/crops', async (req, res) => {
//   try {
//     const crops = await cropsCollection.find({}).toArray();
//     res.json(crops);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch crops' });
//   } finally {
   
//   }
// });


// //latest crops
// app.get('/latest-crops', async (req, res) => {
//   try {
//     await client.connect();
//     const database = client.db('kirishiLink');
//     const cropsCollection = database.collection('product');

//     // Sort by _id (MongoDB automatically generates in order of creation)
//     const latestCrops = await cropsCollection
//       .find({})
//       .sort({ _id: -1 }) // newest first
//       .limit(6)
//       .toArray();

//     res.send(latestCrops);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch latest crops' });
//   }
// });
// //
// // server/index.js
// app.post('/crops', async (req, res) => {
//   try {
//     const crop = req.body;
//     const database = client.db('kirishiLink');
//     const cropsCollection = database.collection('product');
//     const result = await cropsCollection.insertOne(crop);
//     res.status(201).json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to add crop' });
//   }
// });


// //
// // Interest POST route
// app.post("/crops/:id/interest", async (req, res) => {
//   const { id } = req.params;
//   const interest = req.body; // cropId, userEmail, userName, quantity, message, status
//   const result = await cropsCollection.updateOne(
//     { _id: new ObjectId(id) },
//     { $push: { interests: interest } }
//   );
//   res.send(interest);
// });

// app.put("/crops/:id/interest", async (req, res) => {
//   const { id } = req.params;
//   const { interestId, status } = req.body;
//   const result = await cropsCollection.updateOne(
//     { _id: new ObjectId(id), "interests._id": new ObjectId(interestId) },
//     { $set: { "interests.$.status": status } }
//   );
//   res.send(result);
// });


// //
// // GET route: fetch all interests sent by a user
// app.get("/my-interests", async (req, res) => {
//   try {
//     const userEmail = req.query.userEmail;
//     if (!userEmail) return res.status(400).json({ error: "userEmail is required" });

//     // Find all crops where this user has sent interest
//     const cropsWithInterests = await cropsCollection
//       .find({ "interests.userEmail": userEmail })
//       .toArray();

//     // Filter interests to only include this user's interest
//     const result = cropsWithInterests.map(crop => {
//       return {
//         _id: crop._id,
//         name: crop.name,
//         owner: crop.owner,
//         interests: crop.interests.filter(i => i.userEmail === userEmail)
//       };
//     });

//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch user interests" });
//   }
// });



// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const port = 3000;

const uri = "mongodb+srv://kirishi-link:aIctiiro3ghFyRZK@cluster0.mvbamfj.mongodb.net/krishiLinkDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(cors());
app.use(express.json());

let cropsCollection;

// MongoDB connect এবং সার্ভার start
client.connect()
  .then(() => {
    const database = client.db('kirishiLink');
    cropsCollection = database.collection('product');
    console.log("MongoDB connected successfully!");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => console.error("Failed to connect to MongoDB", err));


// GET all crops
app.get('/crops', async (req, res) => {
  try {
    const crops = await cropsCollection.find({}).toArray();
    res.json(crops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch crops' });
  }
});

// Latest crops
app.get('/latest-crops', async (req, res) => {
  try {
    const latestCrops = await cropsCollection
      .find({})
      .sort({ _id: -1 })
      .limit(6)
      .toArray();
    res.json(latestCrops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch latest crops' });
  }
});

// Add a new crop
app.post('/crops', async (req, res) => {
  try {
    const crop = req.body;
    const result = await cropsCollection.insertOne(crop);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add crop' });
  }
});

// Submit interest
app.post("/crops/:id/interest", async (req, res) => {
  const { id } = req.params;
  const interest = { ...req.body, _id: new ObjectId() }; // নতুন _id তৈরি
  try {
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

// Update interest status
// app.put("/crops/:id/interest", async (req, res) => {
//   const { id } = req.params;
//   const { interestId, status } = req.body;
//   try {
//     const result = await cropsCollection.findOneAndUpdate(
//       { _id: new ObjectId(id), "interests._id": new ObjectId(interestId) },
//       { $set: { "interests.$.status": status } },
//       { returnDocument: "after" }
//     );

//     const updatedInterest = result.value.interests.find(
//       i => String(i._id) === interestId
//     );
//     res.json(updatedInterest);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to update interest" });
//   }
// });
app.put("/crops/:id/interest", async (req, res) => {
  const { id } = req.params;
  const { interestId, status } = req.body;

  try {
    // Find the crop
    const crop = await cropsCollection.findOne({ _id: new ObjectId(id) });
    if (!crop) return res.status(404).json({ error: "Crop not found" });

    // Update the specific interest
    const updatedInterests = crop.interests.map(i =>
      String(i._id) === interestId ? { ...i, status } : i
    );

    // Save back to DB
    await cropsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { interests: updatedInterests } }
    );

    // Return updated interest object
    const updatedInterest = updatedInterests.find(i => String(i._id) === interestId);
    res.json(updatedInterest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update interest" });
  }
});


// Fetch all interests sent by a user
app.get("/my-interests", async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    if (!userEmail) return res.status(400).json({ error: "userEmail is required" });

    const cropsWithInterests = await cropsCollection
      .find({ "interests.userEmail": userEmail })
      .toArray();

    const result = cropsWithInterests.map(crop => ({
      _id: crop._id,
      name: crop.name,
      owner: crop.owner,
      interests: crop.interests.filter(i => i.userEmail === userEmail)
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user interests" });
  }
});
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
