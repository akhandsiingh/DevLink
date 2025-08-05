"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useEffect, useContext } from "react"

// Components
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import PrivateRoute from "./components/routing/PrivateRoute"

// Pages
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import CreateProfile from "./pages/CreateProfile"
import EditProfile from "./pages/EditProfile"
import Profiles from "./pages/Profiles"
import Profile from "./pages/Profile"
import NotFound from "./pages/NotFound"

// Context
import { AuthContext, AuthProvider } from "./context/auth/AuthContext"
import { ProfileProvider } from "./context/profile/ProfileContext"
import { AlertProvider } from "./context/alert/AlertContext"

// App wrapper to use context
const AppContent = () => {
  const { loadUser, isAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    // Load user on app start
    loadUser()
  }, [])

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-6 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-profile"
              element={
                <PrivateRoute>
                  <CreateProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer position="bottom-right" />
    </Router>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AlertProvider>
          <AppContent />
        </AlertProvider>
      </ProfileProvider>
    </AuthProvider>
  )
}

export default App
