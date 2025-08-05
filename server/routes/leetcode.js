const express = require("express")
const router = express.Router()
const axios = require("axios")
const cheerio = require("cheerio")
const { protect } = require("../middleware/auth")
const Profile = require("../models/Profile")

/**
 * @swagger
 * /api/leetcode/stats/{username}:
 *   get:
 *     summary: Get LeetCode statistics for a username
 *     tags: [LeetCode]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: LeetCode username
 *     responses:
 *       200:
 *         description: LeetCode statistics
 */
router.get("/stats/:username", async (req, res) => {
  try {
    const username = req.params.username

    if (!username) {
      return res.status(400).json({
        success: false,
        error: "Username is required",
      })
    }

    let leetcodeData = null

    // Method 1: Try leetcode-stats-api
    try {
      console.log(`Trying leetcode-stats-api for user: ${username}`)
      const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}`, {
        timeout: 10000,
        headers: {
          "User-Agent": "DevLinker-App",
        },
      })

      if (response.data && response.data.status === "success") {
        const data = response.data
        leetcodeData = {
          profile: {
            username: username,
            realName: data.name || "N/A",
            ranking: data.ranking || "N/A",
            reputation: data.reputation || 0,
          },
          problemsSolved: {
            total: data.totalSolved || 0,
            easy: data.easySolved || 0,
            medium: data.mediumSolved || 0,
            hard: data.hardSolved || 0,
          },
          contestStats: {
            rating: data.contestRating || "N/A",
            globalRanking: data.contestGlobalRanking || "N/A",
            attendedContestsCount: data.contestAttended || 0,
          },
          additionalStats: {
            acceptanceRate: data.acceptanceRate || 0,
            contributionPoints: data.contributionPoints || 0,
          },
        }
        console.log("Successfully fetched data from leetcode-stats-api")
      }
    } catch (error) {
      console.log("leetcode-stats-api failed:", error.message)
    }

    // Method 2: Try alfa-leetcode-api if first method failed
    if (!leetcodeData) {
      try {
        console.log(`Trying alfa-leetcode-api for user: ${username}`)
        const response = await axios.get(`https://alfa-leetcode-api.onrender.com/${username}`, {
          timeout: 10000,
          headers: {
            "User-Agent": "DevLinker-App",
          },
        })

        if (response.data) {
          const data = response.data
          leetcodeData = {
            profile: {
              username: username,
              realName: data.name || "N/A",
              ranking: data.ranking || "N/A",
              reputation: data.reputation || 0,
            },
            problemsSolved: {
              total: data.totalSolved || 0,
              easy: data.easySolved || 0,
              medium: data.mediumSolved || 0,
              hard: data.hardSolved || 0,
            },
            contestStats: {
              rating: data.contestRating || "N/A",
              globalRanking: "N/A",
              attendedContestsCount: data.contestAttended || 0,
            },
            additionalStats: {
              acceptanceRate: data.acceptanceRate || 0,
              contributionPoints: 0,
            },
          }
          console.log("Successfully fetched data from alfa-leetcode-api")
        }
      } catch (error) {
        console.log("alfa-leetcode-api failed:", error.message)
      }
    }

    // Method 3: Try web scraping as last resort
    if (!leetcodeData) {
      try {
        console.log(`Trying web scraping for user: ${username}`)
        const response = await axios.get(`https://leetcode.com/${username}/`, {
          timeout: 15000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        })

        const $ = cheerio.load(response.data)

        // Try to extract data from the page
        const scriptTags = $("script").toArray()
        let userData = null

        for (const script of scriptTags) {
          const content = $(script).html()
          if (content && content.includes("userStatus")) {
            try {
              // Extract JSON data from script tag
              const jsonMatch = content.match(/window\.userStatus\s*=\s*({.*?});/)
              if (jsonMatch) {
                userData = JSON.parse(jsonMatch[1])
                break
              }
            } catch (parseError) {
              continue
            }
          }
        }

        if (userData) {
          leetcodeData = {
            profile: {
              username: username,
              realName: userData.realName || "N/A",
              ranking: userData.ranking || "N/A",
              reputation: userData.reputation || 0,
            },
            problemsSolved: {
              total: userData.numAcceptedQuestions || 0,
              easy: 0, // Not available from scraping
              medium: 0,
              hard: 0,
            },
            contestStats: {
              rating: "N/A",
              globalRanking: "N/A",
              attendedContestsCount: 0,
            },
            additionalStats: {
              acceptanceRate: 0,
              contributionPoints: 0,
            },
          }
          console.log("Successfully scraped data from LeetCode profile")
        }
      } catch (error) {
        console.log("Web scraping failed:", error.message)
      }
    }

    // If all methods failed, return error
    if (!leetcodeData) {
      return res.status(404).json({
        success: false,
        error: "Unable to fetch LeetCode data. Please check if the username is correct and the profile is public.",
      })
    }

    // Add timestamp
    leetcodeData.lastUpdated = new Date().toISOString()

    res.status(200).json({
      success: true,
      data: leetcodeData,
    })
  } catch (error) {
    console.error("LeetCode API Error:", error.message)
    res.status(500).json({
      success: false,
      error: "Failed to fetch LeetCode statistics",
    })
  }
})

/**
 * @swagger
 * /api/leetcode/stats:
 *   get:
 *     summary: Get LeetCode statistics for the current user's LeetCode profile
 *     tags: [LeetCode]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: LeetCode statistics
 */
router.get("/stats", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      })
    }

    // Find LeetCode platform
    const leetcodePlatform = profile.platforms.find((platform) => platform.name === "LeetCode")

    if (!leetcodePlatform) {
      return res.status(404).json({
        success: false,
        error: "LeetCode profile not found",
      })
    }

    const username = leetcodePlatform.username

    // Redirect to the username-based endpoint
    const statsResponse = await axios.get(`${req.protocol}://${req.get("host")}/api/leetcode/stats/${username}`)

    res.status(200).json(statsResponse.data)
  } catch (error) {
    console.error("LeetCode stats error:", error.message)
    res.status(500).json({
      success: false,
      error: "Failed to fetch LeetCode statistics",
    })
  }
})

// Test endpoint for debugging
router.get("/test/:username", async (req, res) => {
  const username = req.params.username

  res.json({
    message: `Testing LeetCode API for user: ${username}`,
    endpoints: [
      `https://leetcode-stats-api.herokuapp.com/${username}`,
      `https://alfa-leetcode-api.onrender.com/${username}`,
      `https://leetcode.com/${username}/`,
    ],
    timestamp: new Date().toISOString(),
  })
})

module.exports = router
