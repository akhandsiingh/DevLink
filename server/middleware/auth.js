const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Protect routes
exports.protect = async (req, res, next) => {
  let token

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(" ")[1]
      console.log("Token received:", token ? "Valid token format" : "Invalid token format")
    } else if (req.cookies?.token) {
      // Set token from cookie
      token = req.cookies.token
      console.log("Token from cookie:", token ? "Valid token format" : "Invalid token format")
    }

    // Make sure token exists
    if (!token) {
      console.log("Authentication failed: No token provided")
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this route",
      })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log("Token verified successfully for user ID:", decoded.id)

      // Find user by ID
      const user = await User.findById(decoded.id)

      if (!user) {
        console.log("Authentication failed: User not found")
        return res.status(401).json({
          success: false,
          error: "User not found",
        })
      }

      req.user = user
      next()
    } catch (err) {
      console.log("Token verification failed:", err.message)
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this route",
      })
    }
  } catch (err) {
    console.error("Auth middleware error:", err)
    return res.status(500).json({
      success: false,
      error: "Server error in authentication",
    })
  }
}
