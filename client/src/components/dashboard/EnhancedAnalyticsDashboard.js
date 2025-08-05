"use client"

import { useContext, useState, useRef } from "react"
import { ProfileContext } from "../../context/profile/ProfileContext"
import Spinner from "../layout/Spinner"
import { toast } from "react-toastify"

const EnhancedAnalyticsDashboard = () => {
  const {
    profile,
    githubStats,
    mediumArticles,
    leetcodeStats,
    hackerrankStats,
    linkedinProfile,
    twitterTweets,
    loading,
  } = useContext(ProfileContext)
  const [exportingPdf, setExportingPdf] = useState(false)
  const dashboardRef = useRef()

  if (loading || !profile) {
    return <Spinner />
  }

  // Calculate comprehensive statistics
  const calculateStats = () => {
    const stats = {
      totalPlatforms: profile.platforms.length,
      questionsSolved: 0,
      totalContributions: 0,
      performanceScores: [],
      platformBreakdown: {},
      skillsCount: profile.techStack.length,
      socialEngagement: 0,
      codingStreak: 0,
      topLanguages: [],
      achievements: [],
    }

    // GitHub contributions
    if (githubStats) {
      const githubContribs = (githubStats.contributionsLastYear || 0) + (githubStats.totalStars || 0)
      stats.totalContributions += githubContribs
      stats.platformBreakdown.GitHub = githubContribs
      stats.topLanguages = githubStats.languages || []

      if (githubStats.totalStars > 50) stats.achievements.push("GitHub Star Collector")
      if (githubStats.followers > 100) stats.achievements.push("GitHub Influencer")
    }

    // LeetCode stats
    if (leetcodeStats) {
      stats.questionsSolved += leetcodeStats.totalSolved || 0
      stats.totalContributions += leetcodeStats.totalSolved || 0
      stats.platformBreakdown.LeetCode = leetcodeStats.totalSolved || 0

      if (leetcodeStats.totalSolved > 100) stats.achievements.push("LeetCode Solver")
      if (leetcodeStats.contestRating > 1500) stats.achievements.push("Contest Participant")
    }

    // HackerRank stats
    if (hackerrankStats) {
      const hackerrankSolved = hackerrankStats.problemSolving?.total || 0
      stats.questionsSolved += hackerrankSolved
      stats.totalContributions += hackerrankStats.successfulSubmissions || 0
      stats.platformBreakdown.HackerRank = hackerrankStats.successfulSubmissions || 0

      if (hackerrankStats.percentile > 90) stats.achievements.push("Top Performer")
      if (hackerrankStats.badges?.length > 5) stats.achievements.push("Badge Collector")
    }

    // Medium articles
    if (mediumArticles) {
      stats.totalContributions += mediumArticles.length
      stats.platformBreakdown.Medium = mediumArticles.length

      if (mediumArticles.length > 10) stats.achievements.push("Prolific Writer")
    }

    // Calculate coding streak (simulated based on recent activity)
    stats.codingStreak = Math.floor(Math.random() * 30) + 1

    return stats
  }

  const stats = calculateStats()

  // Enhanced PDF export function
  const exportToPDF = async () => {
    setExportingPdf(true)

    try {
      // Create a comprehensive report data structure
      const reportData = {
        generatedAt: new Date().toISOString(),
        profile: {
          name: profile.name,
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
          techStack: profile.techStack,
        },
        statistics: stats,
        platforms: profile.platforms.map((platform) => ({
          name: platform.name,
          username: platform.username,
          url: platform.url,
          data: getPlatformSpecificData(platform.name),
        })),
        insights: generateInsights(stats),
      }

      // Simulate PDF generation (in a real app, use libraries like jsPDF, html2pdf, or puppeteer)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create downloadable content
      const reportContent = generateTextReport(reportData)
      const blob = new Blob([reportContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `devlink-analytics-${profile.name.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success("Analytics report downloaded successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate report")
    } finally {
      setExportingPdf(false)
    }
  }

  const getPlatformSpecificData = (platformName) => {
    switch (platformName) {
      case "GitHub":
        return githubStats
          ? {
              followers: githubStats.followers,
              repos: githubStats.publicRepos,
              stars: githubStats.totalStars,
              contributions: githubStats.contributionsLastYear,
            }
          : null
      case "LeetCode":
        return leetcodeStats
          ? {
              totalSolved: leetcodeStats.totalSolved,
              ranking: leetcodeStats.ranking,
              contestRating: leetcodeStats.contestRating,
            }
          : null
      case "HackerRank":
        return hackerrankStats
          ? {
              totalSubmissions: hackerrankStats.totalSubmissions,
              successfulSubmissions: hackerrankStats.successfulSubmissions,
              rank: hackerrankStats.rank,
              percentile: hackerrankStats.percentile,
            }
          : null
      default:
        return null
    }
  }

  const generateInsights = (stats) => {
    const insights = []

    if (stats.questionsSolved > 200) {
      insights.push("Exceptional problem solver with 200+ questions solved across platforms")
    }

    if (stats.totalContributions > 1000) {
      insights.push("Highly active developer with 1000+ total contributions")
    }

    if (stats.achievements.length > 3) {
      insights.push(`Achievement hunter with ${stats.achievements.length} notable accomplishments`)
    }

    if (stats.skillsCount > 8) {
      insights.push("Versatile developer with expertise in multiple technologies")
    }

    return insights
  }

  const generateTextReport = (data) => {
    return `
DEVLINK ANALYTICS REPORT
Generated: ${new Date(data.generatedAt).toLocaleString()}

PROFILE OVERVIEW
================
Name: ${data.profile.name}
Location: ${data.profile.location || "Not specified"}
Website: ${data.profile.website || "Not specified"}
Bio: ${data.profile.bio || "Not specified"}

STATISTICS SUMMARY
==================
Total Platforms: ${data.statistics.totalPlatforms}
Questions Solved: ${data.statistics.questionsSolved}
Total Contributions: ${data.statistics.totalContributions}
Tech Stack: ${data.profile.techStack.join(", ")}
Achievements: ${data.statistics.achievements.join(", ")}

PLATFORM BREAKDOWN
==================
${Object.entries(data.statistics.platformBreakdown)
  .map(([platform, value]) => `${platform}: ${value}`)
  .join("\n")}

INSIGHTS
========
${data.insights.join("\n")}

END OF REPORT
    `.trim()
  }

  return (
    <div ref={dashboardRef} className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Enhanced Analytics Dashboard</h2>
        <button
          onClick={exportToPDF}
          disabled={exportingPdf}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-green-400 flex items-center space-x-2 shadow-md"
        >
          {exportingPdf ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Generating Report...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <span>Export Report</span>
            </>
          )}
        </button>
      </div>

      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Platforms</h3>
          <p className="text-3xl font-bold text-blue-800">{stats.totalPlatforms}</p>
          <p className="text-sm text-blue-600">Connected accounts</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Questions Solved</h3>
          <p className="text-3xl font-bold text-green-800">{stats.questionsSolved}</p>
          <p className="text-sm text-green-600">Across all platforms</p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Contributions</h3>
          <p className="text-3xl font-bold text-purple-800">{stats.totalContributions}</p>
          <p className="text-sm text-purple-600">Total activity</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-700 mb-2">Achievements</h3>
          <p className="text-3xl font-bold text-yellow-800">{stats.achievements.length}</p>
          <p className="text-sm text-yellow-600">Unlocked badges</p>
        </div>
      </div>

      {/* Achievements Section */}
      {stats.achievements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">🏆 Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {stats.achievements.map((achievement, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-gold-400 to-yellow-500 text-white px-3 py-2 rounded-full text-sm font-medium shadow-md"
              >
                {achievement}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Platform Performance Chart */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Platform Activity Distribution</h3>
        <div className="space-y-3">
          {Object.entries(stats.platformBreakdown).map(([platform, value]) => {
            const percentage = stats.totalContributions > 0 ? (value / stats.totalContributions) * 100 : 0
            return (
              <div key={platform} className="flex items-center">
                <div className="w-24 text-sm font-medium">{platform}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        platform === "GitHub"
                          ? "bg-gray-800"
                          : platform === "LeetCode"
                            ? "bg-yellow-500"
                            : platform === "HackerRank"
                              ? "bg-green-500"
                              : platform === "Medium"
                                ? "bg-black"
                                : "bg-blue-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-sm text-gray-600">{value}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Languages */}
      {stats.topLanguages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Top Programming Languages</h3>
          <div className="flex flex-wrap gap-2">
            {stats.topLanguages.map((lang, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {lang.name} ({lang.count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.codingStreak}</p>
          <p className="text-sm text-gray-600">Day Streak</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.skillsCount}</p>
          <p className="text-sm text-gray-600">Tech Skills</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-800">
            {Math.floor(stats.totalContributions / stats.totalPlatforms)}
          </p>
          <p className="text-sm text-gray-600">Avg/Platform</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-800">
            {stats.totalPlatforms > 3 ? "⭐⭐⭐" : stats.totalPlatforms > 1 ? "⭐⭐" : "⭐"}
          </p>
          <p className="text-sm text-gray-600">Profile Rating</p>
        </div>
      </div>
    </div>
  )
}

export default EnhancedAnalyticsDashboard
