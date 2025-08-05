const mongoose = require("mongoose")

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       required:
 *         - user
 *         - name
 *       properties:
 *         user:
 *           type: string
 *           description: Reference to the user who owns this profile
 *         name:
 *           type: string
 *           description: Developer's full name
 *         bio:
 *           type: string
 *           description: Short bio about the developer
 *         location:
 *           type: string
 *           description: Developer's location
 *         website:
 *           type: string
 *           description: Developer's personal website
 *         techStack:
 *           type: array
 *           items:
 *             type: string
 *           description: List of technologies the developer is proficient in
 *         platforms:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Platform name (GitHub, LinkedIn, etc.)
 *               username:
 *                 type: string
 *                 description: Username on that platform
 *               url:
 *                 type: string
 *                 description: Profile URL
 *         createdAt:
 *           type: string
 *           format: date
 *           description: Date when profile was created
 */
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  techStack: {
    type: [String],
    default: [],
  },
  platforms: [
    {
      name: {
        type: String,
        required: [true, "Please provide a platform name"],
        enum: [
          "GitHub",
          "LinkedIn",
          "LeetCode",
          "HackerRank",
          "Medium",
          "Twitter",
          "X",
          "StackOverflow",
          "Kaggle",
          "CodePen",
          "Dev.to",
          "GitLab",
          "Instagram",
          "YouTube",
          "TikTok",
          "Behance",
          "Dribbble",
          "Other",
        ],
      },
      username: {
        type: String,
        required: [true, "Please provide a username"],
      },
      url: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Profile", ProfileSchema)
