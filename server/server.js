const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const swaggerUi = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")
const dotenv = require("dotenv")
const path = require("path")

// Load env vars
dotenv.config()

// Routes
const authRoutes = require("./routes/auth")
const profileRoutes = require("./routes/profiles")
const githubRoutes = require("./routes/github")
const mediumRoutes = require("./routes/medium")
const platformRoutes = require("./routes/platforms")
const leetcodeRoutes = require("./routes/leetcode")
const hackerrankRoutes = require("./routes/hackerrank")
const linkedinRoutes = require("./routes/linkedin")
const twitterRoutes = require("./routes/twitter")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DevLink API",
      version: "1.0.0",
      description: "Developer Profile Aggregator API",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/profiles", profileRoutes)
app.use("/api/github", githubRoutes)
app.use("/api/medium", mediumRoutes)
app.use("/api/platforms", platformRoutes)
app.use("/api/leetcode", leetcodeRoutes)
app.use("/api/hackerrank", hackerrankRoutes)
app.use("/api/linkedin", linkedinRoutes)
app.use("/api/twitter", twitterRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack)
  res.status(500).json({
    success: false,
    error: "Server error",
  })
})

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`)
})
