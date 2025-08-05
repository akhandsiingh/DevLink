const express = require("express")
const router = express.Router()
const axios = require("axios")
const { protect } = require("../middleware/auth")
const Profile = require("../models/Profile")

/**
 * @swagger
 * /api/github/stats/{username}:
 *   get:
 *     summary: Get GitHub statistics for a username
 *     tags: [GitHub]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: GitHub username
 *     responses:
 *       200:
 *         description: GitHub statistics
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
router.get("/stats/:username", async (req, res) => {
  try {
    const username = req.params.username

    if (!username) {
      return res.status(400).json({
        success: false,
        error: "Username is required",
      })
    }

    // GitHub API headers
    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "DevLinker-App",
    }

    // Add GitHub token if available
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`
    }

    // Fetch user data
    const userResponse = await axios.get(`https://api.github.com/users/${username}`, {
      headers,
      timeout: 10000,
    })

    const userData = userResponse.data

    // Fetch repositories
    const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers,
      timeout: 10000,
    })

    const repositories = reposResponse.data

    // Calculate statistics
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0)
    const totalWatchers = repositories.reduce((sum, repo) => sum + repo.watchers_count, 0)

    // Get language statistics
    const languages = {}
    repositories.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1
      }
    })

    // Get top repositories (by stars)
    const topRepos = repositories
      .filter((repo) => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        url: repo.html_url,
        updated_at: repo.updated_at,
      }))

    // Try to fetch recent activity (events)
    let recentActivity = []
    try {
      const eventsResponse = await axios.get(`https://api.github.com/users/${username}/events/public?per_page=10`, {
        headers,
        timeout: 5000,
      })

      recentActivity = eventsResponse.data.slice(0, 5).map((event) => ({
        type: event.type,
        repo: event.repo?.name,
        created_at: event.created_at,
        payload: {
          action: event.payload?.action,
          ref: event.payload?.ref,
          commits: event.payload?.commits?.length || 0,
        },
      }))
    } catch (eventError) {
      console.log("Could not fetch recent activity:", eventError.message)
    }

    // Prepare response data
    const githubStats = {
      profile: {
        username: userData.login,
        name: userData.name,
        bio: userData.bio,
        avatar_url: userData.avatar_url,
        html_url: userData.html_url,
        company: userData.company,
        location: userData.location,
        email: userData.email,
        blog: userData.blog,
        twitter_username: userData.twitter_username,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      },
      stats: {
        public_repos: userData.public_repos,
        public_gists: userData.public_gists,
        followers: userData.followers,
        following: userData.following,
        total_stars: totalStars,
        total_forks: totalForks,
        total_watchers: totalWatchers,
      },
      languages: Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .reduce((obj, [lang, count]) => {
          obj[lang] = count
          return obj
        }, {}),
      topRepositories: topRepos,
      recentActivity: recentActivity,
      lastUpdated: new Date().toISOString(),
    }

    res.status(200).json({
      success: true,
      data: githubStats,
    })
  } catch (error) {
    console.error("GitHub API Error:", error.message)

    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: "GitHub user not found",
      })
    }

    if (error.response?.status === 403) {
      return res.status(429).json({
        success: false,
        error: "GitHub API rate limit exceeded. Please try again later.",
      })
    }

    res.status(500).json({
      success: false,
      error: "Failed to fetch GitHub statistics",
    })
  }
})

/**
 * @swagger
 * /api/github/stats:
 *   get:
 *     summary: Get GitHub statistics for the current user's GitHub profile
 *     tags: [GitHub]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: GitHub statistics
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

    // Find GitHub platform
    const githubPlatform = profile.platforms.find((platform) => platform.name === "GitHub")

    if (!githubPlatform) {
      return res.status(404).json({
        success: false,
        error: "GitHub profile not found",
      })
    }

    // Redirect to the username-based endpoint
    const username = githubPlatform.username
    const statsResponse = await axios.get(`${req.protocol}://${req.get("host")}/api/github/stats/${username}`)

    res.status(200).json(statsResponse.data)
  } catch (error) {
    console.error("GitHub stats error:", error.message)
    res.status(500).json({
      success: false,
      error: "Failed to fetch GitHub statistics",
    })
  }
})

module.exports = router
