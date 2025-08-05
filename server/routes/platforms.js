const express = require("express")
const router = express.Router()

/**
 * @swagger
 * /api/platforms:
 *   get:
 *     summary: Get list of supported platforms
 *     tags: [Platforms]
 *     responses:
 *       200:
 *         description: List of supported platforms
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
 *                     properties:
 *                       name:
 *                         type: string
 *                       baseUrl:
 *                         type: string
 */
router.get("/", (req, res) => {
  // Ensure we're sending a proper response
  console.log("Platforms API called")

  const platforms = [
    {
      name: "GitHub",
      baseUrl: "https://github.com/",
      description: "Code hosting platform for version control and collaboration",
      icon: "github",
      category: "developer",
    },
    {
      name: "LinkedIn",
      baseUrl: "https://linkedin.com/in/",
      description: "Professional networking platform",
      icon: "linkedin",
      category: "social",
      features: ["posts", "connections", "interactions", "comments"],
    },
    {
      name: "LeetCode",
      baseUrl: "https://leetcode.com/",
      description: "Platform to help you enhance your skills and prepare for technical interviews",
      icon: "code",
      category: "developer",
    },
    {
      name: "HackerRank",
      baseUrl: "https://www.hackerrank.com/",
      description: "Competitive programming challenges for both consumers and businesses",
      icon: "code",
      category: "developer",
    },
    {
      name: "Medium",
      baseUrl: "https://medium.com/@",
      description: "Online publishing platform",
      icon: "book",
      category: "content",
    },
    {
      name: "X",
      baseUrl: "https://x.com/",
      description: "Social networking service (formerly Twitter)",
      icon: "twitter",
      category: "social",
      features: ["tweets", "likes", "retweets", "replies"],
    },
    {
      name: "StackOverflow",
      baseUrl: "https://stackoverflow.com/users/",
      description: "Question and answer site for professional and enthusiast programmers",
      icon: "stack",
      category: "developer",
    },
    {
      name: "Dev.to",
      baseUrl: "https://dev.to/",
      description: "Community of software developers",
      icon: "code",
      category: "content",
    },
    {
      name: "CodePen",
      baseUrl: "https://codepen.io/",
      description: "Social development environment for front-end designers and developers",
      icon: "code",
      category: "developer",
    },
    {
      name: "Kaggle",
      baseUrl: "https://www.kaggle.com/",
      description: "Online community of data scientists and machine learning practitioners",
      icon: "database",
      category: "developer",
    },
    {
      name: "Instagram",
      baseUrl: "https://www.instagram.com/",
      description: "Photo and video sharing social networking service",
      icon: "instagram",
      category: "social",
    },
    {
      name: "YouTube",
      baseUrl: "https://www.youtube.com/",
      description: "Video sharing platform",
      icon: "youtube",
      category: "content",
    },
    {
      name: "GitLab",
      baseUrl: "https://gitlab.com/",
      description: "DevOps platform that combines Git repository management",
      icon: "git",
      category: "developer",
    },
  ]

  // Add a slight delay to simulate network latency (helps with debugging)
  setTimeout(() => {
    res.status(200).json({
      success: true,
      data: platforms,
    })
  }, 300)
})

module.exports = router
