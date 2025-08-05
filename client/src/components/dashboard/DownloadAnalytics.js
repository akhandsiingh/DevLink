"use client"

import { useContext, useState } from "react"
import { ProfileContext } from "../../context/profile/ProfileContext"
import { toast } from "react-toastify"

const DownloadAnalytics = () => {
  const { profile, githubStats, leetcodeStats, hackerrankStats, mediumArticles } = useContext(ProfileContext)
  const [format, setFormat] = useState("json")
  const [loading, setLoading] = useState(false)

  // Function to prepare analytics data
  const prepareAnalyticsData = () => {
    // Calculate total contributions across platforms
    const totalContributions = {
      github: githubStats
        ? (githubStats.contributionsLastYear || 0) + (githubStats.totalStars || 0) + (githubStats.publicRepos || 0)
        : 0,
      medium: mediumArticles ? mediumArticles.length : 0,
      leetcode: leetcodeStats ? leetcodeStats.totalSolved : 0,
      hackerrank: hackerrankStats ? hackerrankStats.successfulSubmissions : 0,
    }

    // Calculate total questions solved
    const totalQuestionsSolved =
      (leetcodeStats ? leetcodeStats.totalSolved : 0) +
      (hackerrankStats ? hackerrankStats.problemSolving?.total || 0 : 0)

    // Calculate total active days
    const activeDays = {
      github: githubStats ? githubStats.contributionHistory?.filter((day) => day.count > 0).length || 0 : 0,
      leetcode: leetcodeStats ? leetcodeStats.recentSubmissions?.length || 0 : 0,
      hackerrank: hackerrankStats ? hackerrankStats.recentSubmissions?.length || 0 : 0,
    }

    const totalActiveDays = Object.values(activeDays).reduce((a, b) => a + b, 0)
    const totalPlatformContributions = Object.values(totalContributions).reduce((a, b) => a + b, 0)

    // Prepare platform stats
    const platformStats = profile.platforms.map((platform) => {
      let stats = { name: platform.name, username: platform.username, url: platform.url }

      if (platform.name === "GitHub" && githubStats) {
        stats = {
          ...stats,
          followers: githubStats.followers,
          following: githubStats.following,
          publicRepos: githubStats.publicRepos,
          totalStars: githubStats.totalStars,
          contributions: githubStats.contributionsLastYear,
          topLanguages: githubStats.languages,
          topRepos: githubStats.topRepos,
        }
      } else if (platform.name === "LeetCode" && leetcodeStats) {
        stats = {
          ...stats,
          totalSolved: leetcodeStats.totalSolved,
          easySolved: leetcodeStats.easySolved,
          mediumSolved: leetcodeStats.mediumSolved,
          hardSolved: leetcodeStats.hardSolved,
          ranking: leetcodeStats.ranking,
          contestRating: leetcodeStats.contestRating,
        }
      } else if (platform.name === "HackerRank" && hackerrankStats) {
        stats = {
          ...stats,
          totalSubmissions: hackerrankStats.totalSubmissions,
          successfulSubmissions: hackerrankStats.successfulSubmissions,
          rank: hackerrankStats.rank,
          percentile: hackerrankStats.percentile,
          problemSolving: hackerrankStats.problemSolving,
        }
      } else if (platform.name === "Medium" && mediumArticles) {
        stats = {
          ...stats,
          articleCount: mediumArticles.length,
          articles: mediumArticles.map((article) => ({
            title: article.title,
            link: article.link,
            pubDate: article.pubDate,
            categories: article.categories,
          })),
        }
      }

      return stats
    })

    // Prepare the complete analytics data
    return {
      profile: {
        name: profile.name,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        techStack: profile.techStack,
      },
      summary: {
        totalPlatforms: profile.platforms.length,
        totalContributions: totalPlatformContributions,
        totalQuestionsSolved,
        totalActiveDays,
        contributionsByPlatform: totalContributions,
      },
      platforms: platformStats,
      exportDate: new Date().toISOString(),
      exportVersion: "1.0.0",
    }
  }

  // Function to download data
  const downloadData = () => {
    if (!profile) {
      toast.error("No profile data available")
      return
    }

    setLoading(true)

    try {
      const analyticsData = prepareAnalyticsData()
      let dataStr, fileName, mimeType

      if (format === "json") {
        dataStr = JSON.stringify(analyticsData, null, 2)
        fileName = `devlinker-analytics-${profile.name.toLowerCase().replace(/\s+/g, "-")}.json`
        mimeType = "application/json"
      } else if (format === "csv") {
        // Simple CSV conversion for summary data
        const summary = analyticsData.summary
        const headers = Object.keys(summary).join(",")
        const values = Object.values(summary).join(",")
        dataStr = `${headers}\n${values}`
        fileName = `devlinker-analytics-${profile.name.toLowerCase().replace(/\s+/g, "-")}.csv`
        mimeType = "text/csv"
      }

      // Create a blob and download link
      const blob = new Blob([dataStr], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(`Analytics data downloaded as ${format.toUpperCase()}`)
    } catch (error) {
      console.error("Error downloading analytics:", error)
      toast.error("Failed to download analytics data")
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return null
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">Download Analytics</h3>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-full sm:w-auto">
          <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
            Format
          </label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV (Summary Only)</option>
          </select>
        </div>
        <button
          onClick={downloadData}
          disabled={loading}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 mt-4 sm:mt-0 sm:self-end"
        >
          {loading ? "Downloading..." : "Download Analytics"}
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Download your developer analytics data for use in other applications or for your records.
      </p>
    </div>
  )
}

export default DownloadAnalytics
