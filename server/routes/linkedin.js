const express = require("express")
const router = express.Router()
const axios = require("axios")
const { protect } = require("../middleware/auth")
const Profile = require("../models/Profile")

/**
 * @swagger
 * /api/linkedin/profile/{username}:
 *   get:
 *     summary: Get LinkedIn public profile data for a username
 *     tags: [LinkedIn]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: LinkedIn username
 *     responses:
 *       200:
 *         description: LinkedIn profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
router.get("/profile/:username", async (req, res) => {
  try {
    const username = req.params.username
    console.log(`LinkedIn public profile access attempted for ${username}`)

    // LinkedIn doesn't provide public API access for profile data
    // Real integration would require OAuth and LinkedIn API credentials
    res.status(200).json({
      success: false,
      message: "LinkedIn API Integration Required",
      data: null,
      apiSetup: {
        required: true,
        platform: "LinkedIn",
        description: "LinkedIn requires official API credentials for data access",
        setupSteps: [
          "Register for LinkedIn Developer Account",
          "Create a LinkedIn App",
          "Configure OAuth 2.0 credentials",
          "Request appropriate permissions (r_liteprofile, r_emailaddress)",
          "Implement OAuth flow for user consent",
        ],
        externalApiSupport: true,
        canUseExternalApi: true,
        externalApiNote: "Users can configure their own LinkedIn API credentials",
      },
    })
  } catch (err) {
    console.error("LinkedIn API Error:", err.message)
    res.status(500).json({
      success: false,
      error: "LinkedIn API integration not configured",
      apiSetup: {
        required: true,
        platform: "LinkedIn",
      },
    })
  }
})

/**
 * @swagger
 * /api/linkedin/profile:
 *   get:
 *     summary: Get LinkedIn profile for the current user's LinkedIn profile
 *     tags: [LinkedIn]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: LinkedIn profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
router.get("/profile", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      })
    }

    // Find LinkedIn platform
    const linkedinPlatform = profile.platforms.find((platform) => platform.name === "LinkedIn")

    if (!linkedinPlatform) {
      return res.status(404).json({
        success: false,
        error: "LinkedIn profile not found",
      })
    }

    // Extract username from LinkedIn URL or use the username directly
    let username = linkedinPlatform.username
    if (username.includes("linkedin.com/in/")) {
      username = username.split("linkedin.com/in/")[1].replace(/\/$/, "")
    }

    // Forward the request to the username-based endpoint
    const response = await axios.get(`${req.protocol}://${req.get("host")}/api/linkedin/profile/${username}`)

    res.status(200).json(response.data)
  } catch (err) {
    console.error("LinkedIn API Error:", err.message)
    res.status(500).json({
      success: false,
      error: "Error fetching LinkedIn profile",
    })
  }
})

module.exports = router
