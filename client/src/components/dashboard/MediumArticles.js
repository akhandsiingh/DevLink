"use client"

import { useContext } from "react"
import { ProfileContext } from "../../context/profile/ProfileContext"
import Spinner from "../layout/Spinner"

const MediumArticles = () => {
  const { mediumArticles, loading } = useContext(ProfileContext)

  if (loading) {
    return <Spinner />
  }

  if (!mediumArticles) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Medium Articles</h3>
        <p>Add your Medium profile to see articles here.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Medium Articles</h3>

      {mediumArticles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <ul className="divide-y">
          {mediumArticles.map((article, index) => (
            <li key={index} className="py-3">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                {article.title}
              </a>
              <p className="text-sm text-gray-600 mt-1">{new Date(article.pubDate).toLocaleDateString()}</p>
              <p className="text-sm mt-1">{article.content.substring(0, 100)}...</p>
              {article.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {article.categories.map((category, i) => (
                    <span key={i} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MediumArticles
