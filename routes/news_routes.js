const express = require("express");
const News = require("../models/news_model"); 
const fs = require("fs");
const path = require("path");
const upload = require("../utils/multer");
const router = express.Router();

// Create news with image upload
router.post("/", upload.array("images", 3), async (req, res) => {
  try {
    const { title, text, tags } = req.body;
    const images = req.files.map((file) => `/uploads/${file.filename}`);

    const news = new News({
      title,
      text,
      pictures:images,
      tags: tags ? tags.split(",") : [],
    });

    await news.save();
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get paginated news **Infinite Scroll**
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 3 } = req.query;
    const news = await News.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single news **Increase views**
router.get("/:id", async (req, res) => {
  try {
    if(!req.params.id)return res.status(400).json({message:"Invalid or no ID"})
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    
    news.views += 1;
    await news.save();

    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get news by tag
router.get("/tags/:tag", async (req, res) => {
  try {
    const { page = 1, limit = 3 } = req.query;
    if(!req.params.tag)return res.status(400).json({message:"Invalid or no Tag"})
      const news = await News.find({ tags: req.params.tag }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
    try {

        if(!req.params.id)return res.status(400).json({message:"Invalid or no ID"})
      // Find the news post
      const news = await News.findById(req.params.id);
      if (!news) return res.status(404).json({ message: "News not found" });
  
      // Delete associated image(s)
      if (news.pictures && news.pictures.length > 0) {
        news.pictures.forEach((imagePath) => {
          const filePath = path.join(__dirname, "..", imagePath); 
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting image:", err);
          });
        });
      }
      // Delete news post
      await News.findByIdAndDelete(req.params.id);
      res.json({ message: "News Deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Like news
router.post("/:id/like", async (req, res) => {
  try {
    if(!req.params.id)return res.status(400).json({message:"Invalid or no ID"})
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });

    news.likes += 1;
    await news.save();

    res.json({ likes: news.likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Dislike news
router.post("/:id/dislike", async (req, res) => {
  try {
    if(!req.params.id)return res.status(400).json({message:"Invalid or no ID"})
    const news = await News.findById(req.params.id);

    if (!news) return res.status(404).json({ message: "News not found" });

    news.dislikes += 1;
    await news.save();
    res.json({ dislikes: news.dislikes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;