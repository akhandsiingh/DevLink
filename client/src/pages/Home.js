import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="py-16 text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-12">
        <h1 className="text-5xl font-bold mb-6 text-blue-800">DevLink</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-700">
          Connect all your developer and social media profiles in one place. Showcase your GitHub stats, LinkedIn posts,
          Twitter activity, Medium articles, and more.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-md">
            Sign Up
          </Link>
          <Link
            to="/profiles"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 shadow-md border border-blue-200"
          >
            Browse Profiles
          </Link>
        </div>
      </div>

      <div className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-3xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-3">Aggregate Profiles</h3>
            <p className="text-gray-600">
              Connect all your developer and social media profiles from GitHub, LinkedIn, Twitter, LeetCode, HackerRank,
              Medium, and more in one place.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-3">Social Media Activity</h3>
            <p className="text-gray-600">
              Track your LinkedIn posts, interactions, comments, Twitter tweets, likes, and replies all in one
              dashboard.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-3xl mb-4">💻</div>
            <h3 className="text-xl font-semibold mb-3">GitHub Stats</h3>
            <p className="text-gray-600">
              Display your GitHub statistics including followers, repositories, stars, and top projects.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-3xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-3">Medium Articles</h3>
            <p className="text-gray-600">
              Showcase your latest Medium articles with titles, publication dates, and categories.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-3xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-3">Analytics Dashboard</h3>
            <p className="text-gray-600">
              View comprehensive analytics about your coding and social media activity across all platforms.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-3xl mb-4">💾</div>
            <h3 className="text-xl font-semibold mb-3">Export Data</h3>
            <p className="text-gray-600">
              Download your analytics and profile data in various formats for external use.
            </p>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-blue-800">Ready to get started?</h2>
          <p className="text-xl text-gray-700">
            Join DevLink today and showcase all your developer and social media profiles in one place.
          </p>
        </div>
        <div className="flex justify-center">
          <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-md">
            Create Your Profile
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
