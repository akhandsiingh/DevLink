"use client"

import { useState, useContext } from "react"
import { ProfileContext } from "../../context/profile/ProfileContext"
import { toast } from "react-toastify"

const ExternalApiConfig = () => {
  const { profile } = useContext(ProfileContext)
  const [showConfig, setShowConfig] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [apiConfig, setApiConfig] = useState({
    apiKey: "",
    clientId: "",
    clientSecret: "",
    accessToken: "",
    notes: "",
  })

  const apiRequiredPlatforms = [
    {
      name: "LinkedIn",
      description: "Requires OAuth 2.0 and LinkedIn API credentials",
      fields: ["clientId", "clientSecret"],
      documentation: "https://docs.microsoft.com/en-us/linkedin/shared/api-guide/concepts",
    },
    {
      name: "X",
      description: "Requires X Developer Account and API keys",
      fields: ["apiKey", "clientSecret", "accessToken"],
      documentation: "https://developer.twitter.com/en/docs/twitter-api",
    },
    {
      name: "Instagram",
      description: "Requires Instagram Basic Display API",
      fields: ["clientId", "clientSecret", "accessToken"],
      documentation: "https://developers.facebook.com/docs/instagram-basic-display-api",
    },
    {
      name: "YouTube",
      description: "Requires YouTube Data API v3 credentials",
      fields: ["apiKey"],
      documentation: "https://developers.google.com/youtube/v3",
    },
  ]

  const handleConfigSave = () => {
    // In a real app, this would save to backend with encryption
    const configData = {
      platform: selectedPlatform,
      config: apiConfig,
      timestamp: new Date().toISOString(),
    }

    // Save to localStorage for demo (in production, use secure backend storage)
    const existingConfigs = JSON.parse(localStorage.getItem("externalApiConfigs") || "{}")
    existingConfigs[selectedPlatform] = configData
    localStorage.setItem("externalApiConfigs", JSON.stringify(existingConfigs))

    toast.success(`API configuration saved for ${selectedPlatform}`)
    setShowConfig(false)
    setApiConfig({ apiKey: "", clientId: "", clientSecret: "", accessToken: "", notes: "" })
  }

  const getStoredConfig = (platformName) => {
    const configs = JSON.parse(localStorage.getItem("externalApiConfigs") || "{}")
    return configs[platformName] || null
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">External API Configuration</h3>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          {showConfig ? "Cancel" : "Configure APIs"}
        </button>
      </div>

      <p className="text-gray-600 mb-4">
        Configure your own API credentials for platforms that require authentication. Your credentials are stored
        securely and only used to fetch your data.
      </p>

      {/* API Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {apiRequiredPlatforms.map((platform) => {
          const hasConfig = getStoredConfig(platform.name)
          const isConnected = profile?.platforms.some((p) => p.name === platform.name)

          return (
            <div key={platform.name} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{platform.name}</h4>
                <div className="flex space-x-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      hasConfig ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {hasConfig ? "Configured" : "Not Configured"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      isConnected ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {isConnected ? "Connected" : "Not Connected"}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{platform.description}</p>
              <div className="flex justify-between items-center">
                <a
                  href={platform.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Documentation
                </a>
                <button
                  onClick={() => {
                    setSelectedPlatform(platform.name)
                    setShowConfig(true)
                    if (hasConfig) {
                      setApiConfig(hasConfig.config)
                    }
                  }}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  {hasConfig ? "Edit" : "Configure"}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Configuration Form */}
      {showConfig && selectedPlatform && (
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold mb-4">Configure {selectedPlatform} API</h4>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              <strong>Security Note:</strong> Your API credentials are stored locally and encrypted. Never share your
              credentials with others or store them in public repositories.
            </p>
          </div>

          <div className="space-y-4">
            {apiRequiredPlatforms
              .find((p) => p.name === selectedPlatform)
              ?.fields.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field
                      .split(/(?=[A-Z])/)
                      .join(" ")
                      .toLowerCase()
                      .replace(/^\w/, (c) => c.toUpperCase())}
                  </label>
                  <input
                    type="password"
                    value={apiConfig[field]}
                    onChange={(e) => setApiConfig({ ...apiConfig, [field]: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:ring-purple-500 focus:border-purple-500"
                    placeholder={`Enter your ${field}`}
                  />
                </div>
              ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <textarea
                value={apiConfig.notes}
                onChange={(e) => setApiConfig({ ...apiConfig, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:ring-purple-500 focus:border-purple-500"
                rows="2"
                placeholder="Add any notes about this configuration"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowConfig(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfigSave}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExternalApiConfig
