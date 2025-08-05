"use client"

import { useContext } from "react"
import { ProfileContext } from "../../context/profile/ProfileContext"
import Spinner from "../layout/Spinner"

const HackerrankStats = () => {
  const { hackerrankStats, loading } = useContext(ProfileContext)

  if (loading) {
    return <Spinner />
  }

  if (!hackerrankStats) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">HackerRank Stats</h3>
        <p>Add your HackerRank profile to see stats here.</p>
      </div>
    )
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">HackerRank Stats</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm text-gray-600">Total Submissions</p>
          <p className="text-xl font-bold">{hackerrankStats.totalSubmissions}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm text-gray-600">Successful Submissions</p>
          <p className="text-xl font-bold">{hackerrankStats.successfulSubmissions}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm text-gray-600">Rank</p>
          <p className="text-xl font-bold">{hackerrankStats.rank}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm text-gray-600">Percentile</p>
          <p className="text-xl font-bold">{hackerrankStats.percentile}%</p>
        </div>
      </div>

      {hackerrankStats.problemSolving && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Problem Solving</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-100 p-2 rounded">
              <p className="text-sm font-medium">Total</p>
              <p className="text-lg font-bold">{hackerrankStats.problemSolving.total}</p>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <p className="text-sm font-medium">Algorithms</p>
              <p className="text-lg font-bold">{hackerrankStats.problemSolving.algorithms}</p>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <p className="text-sm font-medium">Data Structures</p>
              <p className="text-lg font-bold">{hackerrankStats.problemSolving.dataStructures}</p>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <p className="text-sm font-medium">Mathematics</p>
              <p className="text-lg font-bold">{hackerrankStats.problemSolving.mathematics}</p>
            </div>
          </div>
        </div>
      )}

      {hackerrankStats.badges && hackerrankStats.badges.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Badges</h4>
          <div className="grid grid-cols-2 gap-2">
            {hackerrankStats.badges.map((badge, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded">
                <p className="text-sm font-medium">{badge.name}</p>
                <div className="flex mt-1">
                  {[...Array(badge.stars)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                  {[...Array(5 - badge.stars)].map((_, i) => (
                    <span key={i} className="text-gray-300">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hackerrankStats.skills && hackerrankStats.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {hackerrankStats.skills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {hackerrankStats.certificates && hackerrankStats.certificates.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Certificates</h4>
          <ul className="divide-y">
            {hackerrankStats.certificates.map((cert, index) => (
              <li key={index} className="py-2">
                <p className="font-medium">{cert.name}</p>
                <p className="text-sm text-gray-600">Earned: {formatDate(cert.date)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hackerrankStats.recentSubmissions && hackerrankStats.recentSubmissions.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Recent Submissions</h4>
          <ul className="divide-y">
            {hackerrankStats.recentSubmissions.map((submission, index) => (
              <li key={index} className="py-2">
                <p className="font-medium">{submission.problem}</p>
                <div className="flex justify-between text-sm">
                  <span className={submission.status === "Accepted" ? "text-green-600" : "text-red-600"}>
                    {submission.status}
                  </span>
                  <span>{submission.language}</span>
                </div>
                <p className="text-xs text-gray-500">{formatDate(submission.date)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hackerrankStats.contests && hackerrankStats.contests.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Contests</h4>
          <ul className="divide-y">
            {hackerrankStats.contests.map((contest, index) => (
              <li key={index} className="py-2">
                <p className="font-medium">{contest.name}</p>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Rank: {contest.rank}</span>
                  <span>Score: {contest.score}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default HackerrankStats
