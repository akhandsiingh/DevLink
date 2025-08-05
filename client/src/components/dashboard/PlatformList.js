"use client"

import { useContext, useState } from "react"
import { ProfileContext } from "../../context/profile/ProfileContext"
import { toast } from "react-toastify"
import Modal from "../ui/Modal"

const PlatformList = ({ platforms }) => {
  const { deletePlatform, githubStats, leetcodeStats, hackerrankStats } = useContext(ProfileContext)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, platformId: null, platformName: "" })

  const handleDeleteClick = (id, name) => {
    setDeleteModal({
      isOpen: true,
      platformId: id,
      platformName: name,
    })
  }

  const handleDeleteConfirm = async () => {
    try {
      const result = await deletePlatform(deleteModal.platformId)

      if (result.success) {
        toast.success(result.msg)
      } else {
        toast.error(result.msg)
      }
    } catch (error) {
      toast.error("Failed to delete platform")
    } finally {
      setDeleteModal({ isOpen: false, platformId: null, platformName: "" })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, platformId: null, platformName: "" })
  }

  // Get platform stats
  const getPlatformStats = (platform) => {
    switch (platform.name) {
      case "GitHub":
        return githubStats
          ? {
              questionsSolved: "N/A",
              contributions: githubStats.contributionsLastYear || 0,
              followers: githubStats.followers || 0,
              repos: githubStats.publicRepos || 0,
              performanceScore: Math.min(
                100,
                Math.floor(
                  ((githubStats.totalStars || 0) + (githubStats.followers || 0) + (githubStats.publicRepos || 0) * 2) /
                    10,
                ),
              ),
            }
          : null
      case "LeetCode":
        return leetcodeStats
          ? {
              questionsSolved: leetcodeStats.totalSolved || 0,
              contributions: leetcodeStats.totalSolved || 0,
              ranking: leetcodeStats.ranking || "N/A",
              contestRating: leetcodeStats.contestRating || "N/A",
              performanceScore: Math.min(
                100,
                Math.floor((leetcodeStats.totalSolved || 0) / 10 + (leetcodeStats.contestRating || 0) / 50),
              ),
            }
          : null
      case "HackerRank":
        return hackerrankStats
          ? {
              questionsSolved: hackerrankStats.problemSolving?.total || 0,
              contributions: hackerrankStats.successfulSubmissions || 0,
              rank: hackerrankStats.rank || "N/A",
              percentile: hackerrankStats.percentile || "N/A",
              performanceScore: Math.min(100, Math.floor(hackerrankStats.percentile || 0)),
            }
          : null
      default:
        return null
    }
  }

  if (!platforms || platforms.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p>No platforms added yet. Add a platform to get started.</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-2 px-3">Platform</th>
              <th className="text-left py-2 px-3">Username</th>
              <th className="text-left py-2 px-3">Questions Solved</th>
              <th className="text-left py-2 px-3">Contributions</th>
              <th className="text-left py-2 px-3">URL</th>
              <th className="text-left py-2 px-3">Performance Score</th>
              <th className="text-left py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {platforms.map((platform) => {
              const stats = getPlatformStats(platform)
              return (
                <tr key={platform._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">{platform.name}</td>
                  <td className="py-2 px-3">{platform.username || "N/A"}</td>
                  <td className="py-2 px-3">{stats ? stats.questionsSolved : "N/A"}</td>
                  <td className="py-2 px-3">{stats ? stats.contributions : "N/A"}</td>
                  <td className="py-2 px-3">
                    {platform.url && (
                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit
                      </a>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {stats ? (
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          stats.performanceScore >= 80
                            ? "bg-green-100 text-green-800"
                            : stats.performanceScore >= 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {stats.performanceScore}%
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleDeleteClick(platform._id, platform.name)}
                      className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Platform"
        message={`Are you sure you want to delete ${deleteModal.platformName} from your profile? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  )
}

export default PlatformList
