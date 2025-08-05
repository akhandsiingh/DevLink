const express = require("express")
const router = express.Router()
const axios = require("axios")
const { protect } = require("../middleware/auth")
const Profile = require("../models/Profile")

/**
 * @swagger
 * /api/twitter/tweets/{username}:
 *   get:
 *     summary: Get Twitter tweets for a username
 *     tags: [Twitter]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Twitter username
 *     responses:
 *       200:
 *         description: Twitter tweets
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
router.get("/tweets/:username", async (req, res) => {
  try {
    const username = req.params.username
    console.log(`X API access attempted for ${username}`)

    // X (Twitter) API requires authentication and has strict rate limits
    res.status(200).json({
      success: false,
      message: "X API Integration Required",
      data: null,
      apiSetup: {
        required: true,
        platform: "X (Twitter)",
        description: "X API requires official developer credentials and has usage limits",
        setupSteps: [
          "Apply for X Developer Account",
          "Create an X App in the Developer Portal",
          "Generate API keys and access tokens",
          "Configure OAuth 1.0a or OAuth 2.0",
          "Implement rate limiting and error handling",
        ],
        externalApiSupport: true,
        canUseExternalApi: true,
        externalApiNote: "Users can configure their own X API credentials",
        rateLimits: "300 requests per 15-minute window for user timeline",
      },
    })
  } catch (err) {
    console.error("X API Error:", err.message)
    res.status(500).json({
      success: false,
      error: "X API integration not configured",
      apiSetup: {
        required: true,
        platform: "X (Twitter)",
      },
    })
  }
})

/**
 * @swagger
 * /api/twitter/tweets:
 *   get:
 *     summary: Get Twitter tweets for the current user's Twitter profile
 *     tags: [Twitter]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Twitter tweets
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
router.get("/tweets", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      })
    }

    // Find Twitter/X platform
    const twitterPlatform = profile.platforms.find((platform) => platform.name === "Twitter" || platform.name === "X")

    if (!twitterPlatform) {
      return res.status(404).json({
        success: false,
        error: "Twitter/X profile not found",
      })
    }

    // Extract username from URL or use directly
    let username = twitterPlatform.username
    if (username.includes("x.com/") || username.includes("twitter.com/")) {
      username = username.split("/").pop().replace(/\/$/, "")
    }

    // Forward the request to the username-based endpoint
    const response = await axios.get(`${req.protocol}://${req.get("host")}/api/twitter/tweets/${username}`)

    res.status(200).json(response.data)
  } catch (err) {
    console.error("Twitter API Error:", err.message)
    res.status(500).json({
      success: false,
      error: "Error fetching Twitter tweets",
    })
  }
})

module.exports = router





