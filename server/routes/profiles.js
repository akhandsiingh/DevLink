const express = require("express")
const router = express.Router()
const Profile = require("../models/Profile")
const { protect } = require("../middleware/auth")

/**
 * @swagger
 * /api/profiles:
 *   post:
 *     summary: Create or update a profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: Profile created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 */
router.post("/", protect, async (req, res) => {
  try {
    const { name, bio, location, website, techStack, platforms } = req.body

    // Check if profile already exists
    let profile = await Profile.findOne({ user: req.user.id })

    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { name, bio, location, website, techStack, platforms },
        { new: true, runValidators: true },
      )
    } else {
      // Create new profile
      profile = await Profile.create({
        user: req.user.id,
        name,
        bio,
        location,
        website,
        techStack,
        platforms,
      })
    }

    res.status(200).json({
      success: true,
      data: profile,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

/**
 * @swagger
 * /api/profiles:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 */
router.get("/", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      })
    }

    res.status(200).json({
      success: true,
      data: profile,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

/**
 * @swagger
 * /api/profiles/all:
 *   get:
 *     summary: Get all profiles
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: List of all profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Profile'
 */
router.get("/all", async (req, res) => {
  try {
    const profiles = await Profile.find()

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

/**
 * @swagger
 * /api/profiles/{id}:
 *   get:
 *     summary: Get profile by ID
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Profile ID
 *     responses:
 *       200:
 *         description: Profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 */
router.get("/:id", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      })
    }

    res.status(200).json({
      success: true,
      data: profile,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

/**
 * @swagger
 * /api/profiles:
 *   delete:
 *     summary: Delete current user's profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
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
router.delete("/", protect, async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user.id })

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

/**
 * @swagger
 * /api/profiles/platform:
 *   post:
 *     summary: Add platform to profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Platform added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 */
router.post("/platform", protect, async (req, res) => {
  try {
    const { name, username, url } = req.body

    const profile = await Profile.findOne({ user: req.user.id })

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      })
    }

    profile.platforms.push({ name, username, url })
    await profile.save()

    res.status(200).json({
      success: true,
      data: profile,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

/**
 * @swagger
 * /api/profiles/platform/{id}:
 *   delete:
 *     summary: Delete platform from profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Platform ID
 *     responses:
 *       200:
 *         description: Platform deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 */
router.delete("/platform/:id", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      })
    }

    // Remove platform
    profile.platforms = profile.platforms.filter((platform) => platform._id.toString() !== req.params.id)

    await profile.save()

    res.status(200).json({
      success: true,
      data: profile,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

/**
 * @swagger
 * /api/profiles/summary:
 *   get:
 *     summary: Get a JSON summary of the developer's portfolio
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Developer portfolio summary
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
router.get("/summary", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      })
    }

    // Create summary object
    const summary = {
      name: profile.name,
      bio: profile.bio,
      location: profile.location,
      website: profile.website,
      techStack: profile.techStack,
      platforms: profile.platforms.map((platform) => ({
        name: platform.name,
        username: platform.username,
        url: platform.url,
      })),
    }

    res.status(200).json({
      success: true,
      data: summary,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

module.exports = router
