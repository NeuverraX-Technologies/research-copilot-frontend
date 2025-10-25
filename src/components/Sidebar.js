// src/components/Sidebar.js - Enhanced with Authentication
import React from "react";
import {
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineDashboard,
  AiOutlineFileText,
  AiOutlineSetting,
  AiOutlineCrown,
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineUser
} from "react-icons/ai";

export default function Sidebar({
  close,
  onSettingsClick,
  onUpgradeClick,
  onLoginClick,
  activeView,
  setActiveView,
  currentUser
}) {
  const menuItems = [
    { id: "home", label: "Home", icon: AiOutlineHome },
    { id: "dashboard", label: "Dashboard", icon: AiOutlineDashboard },
    { id: "myQueries", label: "My Queries", icon: AiOutlineFileText },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // In production, call logout from AuthContext
      localStorage.removeItem('research_copilot_current_user');
      window.location.reload();
    }
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col h-screen shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Research Copilot
          </h1>
          <button
            onClick={close}
            className="text-gray-400 hover:text-white transition p-1 rounded hover:bg-gray-700"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="mb-6 pb-4 border-b border-gray-700">
          <a 
            href="https://neuverrax.com" 
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition group"
            >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
              <span className="font-medium">Back to NeuverraX</span>
          </a>
        </div>

        {/* User Profile Section */}
        {currentUser ? (
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {currentUser.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{currentUser.displayName}</p>
                <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
              </div>
            </div>
            
            {/* Subscription Badge */}
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                currentUser.subscriptionTier === 'pro' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                  : currentUser.subscriptionTier === 'enterprise'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                  : 'bg-gray-700 text-gray-300 border border-gray-600'
              }`}>
                {currentUser.subscriptionTier === 'pro' && <AiOutlineCrown className="inline mr-1" />}
                {currentUser.subscriptionTier}
              </span>
              
              {currentUser.isStudent && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded text-xs font-semibold">
                  🎓 Student
                </span>
              )}
            </div>

            {/* Query Usage for Free Users */}
            {currentUser.subscriptionTier === 'free' && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Queries Today</span>
                  <span className="font-semibold text-white">
                    {currentUser.queriesUsedToday}/{currentUser.dailyQueryLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                    style={{ width: `${(currentUser.queriesUsedToday / currentUser.dailyQueryLimit) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <AiOutlineLogin size={20} />
            Login / Sign Up
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-3 transition ${
              activeView === item.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-r-4 border-white"
                : "text-gray-300 hover:bg-gray-700/50"
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}

        <div className="my-4 border-t border-gray-700" />

        {/* Upgrade Button (for non-Pro users) */}
        {currentUser && currentUser.subscriptionTier === 'free' && (
          <button
            onClick={onUpgradeClick}
            className="mx-4 mb-4 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-semibold transition shadow-lg"
          >
            <AiOutlineCrown size={20} />
            <span>Upgrade to Pro</span>
          </button>
        )}

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          className="w-full flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700/50 transition"
        >
          <AiOutlineSetting size={20} />
          <span className="font-medium">Settings</span>
        </button>

        {/* Logout (if logged in) */}
        {currentUser && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-700/50 transition"
          >
            <AiOutlineLogout size={20} />
            <span className="font-medium">Logout</span>
          </button>
        )}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700">
        <div className="text-xs text-gray-400 space-y-2">
          <div className="flex items-center justify-between">
            <span>Version</span>
            <span className="font-semibold text-gray-300">1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Status</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 font-semibold">Online</span>
            </span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            © 2025 Neuverrax Research Copilot
          </p>
          <div className="flex gap-3 mt-2 text-xs">
            <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Help</a>
          </div>
        </div>
      </div>
    </div>
  );
}