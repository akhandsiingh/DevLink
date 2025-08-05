const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { protect } = require("../middleware/auth")

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    console.log("Register attempt:", { name, email })

    // Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      console.log("Registration failed: User already exists")
      return res.status(400).json({
        success: false,
        error: "User already exists",
      })
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
    })

    // Create token
    const token = user.getSignedJwtToken()
    console.log("User registered successfully:", { id: user._id, email: user.email })

    res.status(200).json({
      success: true,
      token,
    })
  } catch (err) {
    console.error("Registration error:", err)
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    console.log("Login attempt:", { email })

    // Validate email & password
    if (!email || !password) {
      console.log("Login failed: Missing email or password")
      return res.status(400).json({
        success: false,
        error: "Please provide an email and password",
      })
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      console.log("Login failed: User not found")
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      console.log("Login failed: Password doesn't match")
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      })
    }

    // Create token
    const token = user.getSignedJwtToken()
    console.log("User logged in successfully:", { id: user._id, email: user.email })

    res.status(200).json({
      success: true,
      token,
    })
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (err) {
    console.error("Get user error:", err)
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

module.exports = router
