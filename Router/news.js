const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mvbamfj.mongodb.net/blogNewsDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
let newsCollection;

async function init() {
  try {
    
    const db = client.db('blognews'); // DB name
    newsCollection = db.collection('news');
    console.log('News collection ready');
  } catch (err) {
    console.error('Failed to connect to MongoDB for news', err);
  }
}
init();

// GET all news
router.get('/', async (req, res) => {
  try {
    const news = await newsCollection.find({}).toArray();
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// GET single news by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const newsItem = await newsCollection.findOne({ _id: new ObjectId(id) });
    if (!newsItem) return res.status(404).json({ error: 'News not found' });
    res.json(newsItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// POST new news
router.post('/', async (req, res) => {
  try {
    const item = req.body;
    const result = await newsCollection.insertOne(item);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add news' });
  }
});

// UPDATE news
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const result = await newsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: 'after' }
    );
    res.json(result.value);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update news' });
  }
});

// DELETE news
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await newsCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'News deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

module.exports = router;
