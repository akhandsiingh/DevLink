"use client"

import { useContext, useState } from "react"
import { ProfileContext } from "../../context/profile/ProfileContext"
import Spinner from "../layout/Spinner"
import { toast } from "react-toastify"

const AnalyticsDashboard = () => {
  const { profile, githubStats, mediumArticles, leetcodeStats, hackerrankStats, loading } = useContext(ProfileContext)
  const [downloadingPdf, setDownloadingPdf] = useState(false)

  if (loading || !profile) {
    return <Spinner />
  }

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
    (leetcodeStats ? leetcodeStats.totalSolved : 0) + (hackerrankStats ? hackerrankStats.problemSolving?.total || 0 : 0)

  // Calculate total active days
  const activeDays = {
    github: githubStats ? githubStats.contributionHistory?.filter((day) => day.count > 0).length || 0 : 0,
    leetcode: leetcodeStats ? leetcodeStats.recentSubmissions?.length || 0 : 0,
    hackerrank: hackerrankStats ? hackerrankStats.recentSubmissions?.length || 0 : 0,
  }

  const totalActiveDays = Object.values(activeDays).reduce((a, b) => a + b, 0)
  const totalPlatformContributions = Object.values(totalContributions).reduce((a, b) => a + b, 0)

  // Get last active date
  const getLastActiveDate = () => {
    const dates = []

    if (githubStats && githubStats.recentlyUpdatedRepos && githubStats.recentlyUpdatedRepos.length > 0) {
      dates.push(new Date(githubStats.recentlyUpdatedRepos[0].updatedAt))
    }

    if (leetcodeStats && leetcodeStats.recentSubmissions && leetcodeStats.recentSubmissions.length > 0) {
      dates.push(new Date(leetcodeStats.recentSubmissions[0].timestamp * 1000))
    }

    if (hackerrankStats && hackerrankStats.lastActive) {
      dates.push(new Date(hackerrankStats.lastActive))
    }

    if (dates.length === 0) return "Unknown"

    const mostRecent = new Date(Math.max(...dates.map((date) => date.getTime())))
    return mostRecent.toLocaleDateString()
  }

  // Function to download dashboard as PDF
  const downloadAsPdf = () => {
    setDownloadingPdf(true)

    // Simulate PDF generation (in a real app, you'd use a library like jsPDF or html2pdf)
    setTimeout(() => {
      toast.info("PDF download feature will be implemented in the next update")
      setDownloadingPdf(false)
    }, 1500)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Developer Analytics Dashboard</h2>
        <button
          onClick={downloadAsPdf}
          disabled={downloadingPdf}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-400 flex items-center"
        >
          {downloadingPdf ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Export as PDF
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Platforms</h3>
          <p className="text-3xl font-bold">{profile.platforms.length}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Active Days</h3>
          <p className="text-3xl font-bold">{totalActiveDays}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">Questions Solved</h3>
          <p className="text-3xl font-bold">{totalQuestionsSolved}</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-700 mb-2">Total Contributions</h3>
          <p className="text-3xl font-bold">{totalPlatformContributions}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Contribution Distribution</h3>
        <div className="h-8 w-full bg-gray-200 rounded-full overflow-hidden">
          {totalPlatformContributions > 0 ? (
            <>
              <div
                className="h-full bg-blue-500 float-left"
                style={{ width: `${(totalContributions.github / totalPlatformContributions) * 100}%` }}
                title={`GitHub: ${totalContributions.github} contributions`}
              ></div>
              <div
                className="h-full bg-yellow-500 float-left"
                style={{ width: `${(totalContributions.medium / totalPlatformContributions) * 100}%` }}
                title={`Medium: ${totalContributions.medium} articles`}
              ></div>
              <div
                className="h-full bg-purple-500 float-left"
                style={{ width: `${(totalContributions.leetcode / totalPlatformContributions) * 100}%` }}
                title={`LeetCode: ${totalContributions.leetcode} problems`}
              ></div>
              <div
                className="h-full bg-green-500 float-left"
                style={{ width: `${(totalContributions.hackerrank / totalPlatformContributions) * 100}%` }}
                title={`HackerRank: ${totalContributions.hackerrank} submissions`}
              ></div>
            </>
          ) : (
            <div className="h-full bg-gray-300 w-full text-center text-gray-600 text-sm flex items-center justify-center">
              No contributions yet
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-4 mt-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span>GitHub ({totalContributions.github})</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span>Medium ({totalContributions.medium})</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
            <span>LeetCode ({totalContributions.leetcode})</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span>HackerRank ({totalContributions.hackerrank})</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Profile Summary</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-2">
              <span className="font-semibold">Name:</span> {profile.name}
            </div>
            {profile.location && (
              <div className="mb-2">
                <span className="font-semibold">Location:</span> {profile.location}
              </div>
            )}
            {profile.website && (
              <div className="mb-2">
                <span className="font-semibold">Website:</span>{" "}
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {profile.website}
                </a>
              </div>
            )}
            <div className="mb-2">
              <span className="font-semibold">Last Active:</span> {getLastActiveDate()}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Total Contributions:</span> {totalPlatformContributions}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Questions Solved:</span> {totalQuestionsSolved}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Active Days:</span> {totalActiveDays}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {profile.techStack.map((tech, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">Platform Activity</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Platform</th>
                <th className="py-2 px-4 text-left">Username</th>
                <th className="py-2 px-4 text-left">Active Days</th>
                <th className="py-2 px-4 text-left">Questions Solved</th>
                <th className="py-2 px-4 text-left">Contributions</th>
                <th className="py-2 px-4 text-left">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {profile.platforms.map((platform) => {
                let activeDaysCount = 0
                let questionsSolved = "N/A"
                let contributions = 0

                if (platform.name === "GitHub" && githubStats) {
                  activeDaysCount = githubStats.contributionHistory?.filter((day) => day.count > 0).length || 0
                  questionsSolved = "N/A"
                  contributions = githubStats.contributionsLastYear || 0
                } else if (platform.name === "LeetCode" && leetcodeStats) {
                  activeDaysCount = leetcodeStats.recentSubmissions?.length || 0
                  questionsSolved = leetcodeStats.totalSolved || 0
                  contributions = leetcodeStats.totalSolved || 0
                } else if (platform.name === "HackerRank" && hackerrankStats) {
                  activeDaysCount = hackerrankStats.recentSubmissions?.length || 0
                  questionsSolved = hackerrankStats.problemSolving?.total || 0
                  contributions = hackerrankStats.successfulSubmissions || 0
                } else if (platform.name === "Medium" && mediumArticles) {
                  activeDaysCount = mediumArticles.length || 0
                  questionsSolved = "N/A"
                  contributions = mediumArticles.length || 0
                }

                return (
                  <tr key={platform._id}>
                    <td className="py-2 px-4">{platform.name}</td>
                    <td className="py-2 px-4">{platform.username}</td>
                    <td className="py-2 px-4">{activeDaysCount}</td>
                    <td className="py-2 px-4">{questionsSolved}</td>
                    <td className="py-2 px-4">{contributions}</td>
                    <td className="py-2 px-4">
                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
