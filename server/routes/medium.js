const express = require("express")
const router = express.Router()
const axios = require("axios")
const { protect } = require("../middleware/auth")
const Profile = require("../models/Profile")
const Parser = require("rss-parser")

const parser = new Parser()

/**
 * @swagger
 * /api/medium/articles/{username}:
 *   get:
 *     summary: Get Medium articles for a username
 *     tags: [Medium]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Medium username
 *     responses:
 *       200:
 *         description: Medium articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/articles/:username", async (req, res) => {
  try {
    const username = req.params.username
    const feedUrl = `https://medium.com/feed/@${username}`

    const feed = await parser.parseURL(feedUrl)

    const articles = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      content: item.contentSnippet,
      categories: item.categories || [],
    }))

    res.status(200).json({
      success: true,
      data: articles,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error fetching Medium articles",
    })
  }
})

/**
 * @swagger
 * /api/medium/articles:
 *   get:
 *     summary: Get Medium articles for the current user's Medium profile
 *     tags: [Medium]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Medium articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/articles", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      })
    }

    // Find Medium platform
    const mediumPlatform = profile.platforms.find((platform) => platform.name === "Medium")

    if (!mediumPlatform) {
      return res.status(404).json({
        success: false,
        error: "Medium profile not found",
      })
    }

    const username = mediumPlatform.username
    const feedUrl = `https://medium.com/feed/@${username}`

    const feed = await parser.parseURL(feedUrl)

    const articles = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      content: item.contentSnippet,
      categories: item.categories || [],
    }))

    res.status(200).json({
      success: true,
      data: articles,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error fetching Medium articles",
    })
  }
})

module.exports = router
