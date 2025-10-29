// RESEARCHHUB PRO - COMPLETE PRODUCTION APPLICATION
// Using only lucide-react icons (supported library)

import React, { useState, useRef, useEffect } from "react";
import { 
  X, Home, BarChart3, FolderOpen, Settings, LogIn, LogOut, 
  Globe, Search, FileSearch, Clock, User, Languages, 
  HelpCircle, Menu, Beaker, ChevronDown, ChevronRight, 
  ArrowLeft, Crown, CheckCircle, AlertCircle, Download,
  BookOpen, Sparkles
} from "lucide-react";

// ============================================
// CUSTOM ALERT COMPONENT
// ============================================
const CustomAlert = ({ isOpen, onClose, onConfirm, title, message, type = "info" }) => {
  if (!isOpen) return null;

  const icons = {
    info: <AlertCircle size={48} className="text-blue-500" />,
    confirm: <HelpCircle size={48} className="text-orange-500" />,
    success: <CheckCircle size={48} className="text-green-500" />,
    upgrade: <Crown size={48} className="text-yellow-500" />
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">{icons[type] || icons.info}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 justify-end">
          {type === "confirm" && (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold"
          >
            {type === "confirm" ? "Confirm" : type === "upgrade" ? "Upgrade Now" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// RESEARCH MODE SELECTOR
// ============================================
const ResearchModeSelector = ({ activeMode, setActiveMode, currentUser, onUpgrade, isMobile }) => {
  const modes = [
    {
      id: "literature",
      label: "Literature Review",
      icon: FileSearch,
      description: "Comprehensive academic analysis with citations",
      color: "blue",
      isPro: false
    },
    {
      id: "sources",
      label: "Source Discovery",
      icon: Search,
      description: "AI-filtered relevant web sources",
      color: "green",
      isPro: true
    },
    {
      id: "insights",
      label: "Global Insights",
      icon: Globe,
      description: "Expert opinions & sentiment trends",
      color: "purple",
      isPro: true
    }
  ];

  const handleModeClick = (mode) => {
    if (mode.isPro && currentUser?.subscriptionTier !== 'pro') {
      onUpgrade('feature');
      return;
    }
    setActiveMode(mode.id);
  };

  if (isMobile) {
    return (
      <select
        value={activeMode}
        onChange={(e) => {
          const mode = modes.find(m => m.id === e.target.value);
          handleModeClick(mode);
        }}
        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 focus:outline-none focus:border-blue-500"
      >
        {modes.map(mode => (
          <option key={mode.id} value={mode.id}>
            {mode.label} {mode.isPro && currentUser?.subscriptionTier !== 'pro' ? '🔒 Pro' : ''}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {modes.map((mode) => {
        const isLocked = mode.isPro && currentUser?.subscriptionTier !== 'pro';
        const isActive = activeMode === mode.id && !isLocked;
        const Icon = mode.icon;
        
        return (
          <button
            key={mode.id}
            onClick={() => handleModeClick(mode)}
            disabled={!currentUser}
            className={`relative p-6 rounded-xl border-2 transition-all duration-200 ${
              isActive
                ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                : isLocked
                ? "border-gray-200 bg-gray-50 opacity-75"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
            } ${!currentUser ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {isLocked && (
              <div className="absolute top-3 right-3">
                <Crown className="text-yellow-500" size={20} />
              </div>
            )}
            <Icon 
              size={40} 
              className={`mx-auto mb-3 ${
                isActive ? "text-blue-600" : isLocked ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <h3 className={`font-bold text-base mb-2 ${
              isActive ? "text-blue-900" : "text-gray-700"
            }`}>
              {mode.label}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{mode.description}</p>
            {isLocked && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-xs font-semibold text-blue-600">Pro Feature</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ============================================
// SETTINGS MODAL
// ============================================
const SettingsModal = ({ isOpen, onClose, onLogout, currentUser }) => {
  const [activeSection, setActiveSection] = useState("personalization");
  
  if (!isOpen) return null;

  const sections = {
    personalization: {
      icon: User,
      label: "Personalization",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
            <input
              type="text"
              defaultValue={currentUser?.displayName}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Theme</label>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition">
              <option>Light Mode</option>
              <option>Dark Mode</option>
              <option>Auto (System)</option>
            </select>
          </div>
        </div>
      )
    },
    language: {
      icon: Languages,
      label: "Language & Format",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Interface Language</label>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition">
              <option>English</option>
              <option>Hindi (हिन्दी)</option>
              <option>Spanish (Español)</option>
            </select>
          </div>
        </div>
      )
    },
    learn: {
      icon: HelpCircle,
      label: "Learn More",
      content: (
        <div className="space-y-3">
          <a href="https://neuverrax.com/docs" target="_blank" rel="noopener noreferrer" 
             className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
            <div className="flex items-center gap-3 mb-1">
              <BookOpen className="text-blue-600" size={24} />
              <div className="font-semibold text-blue-900">Documentation</div>
            </div>
            <div className="text-sm text-blue-700">Complete guides and reference</div>
          </a>
        </div>
      )
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex">
        <div className="w-56 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">Settings</h3>
          {Object.entries(sections).map(([key, section]) => {
            const Icon = section.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition ${
                  activeSection === key
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{section.label}</span>
              </button>
            );
          })}
          <div className="border-t border-gray-300 my-3" />
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={20} />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
            <h2 className="text-2xl font-bold text-gray-800">
              {sections[activeSection].label}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-white rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {sections[activeSection].content}
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SIDEBAR
// ============================================
const Sidebar = ({ close, onSettingsClick, activeView, setActiveView, currentUser, onLoginClick, isMobile }) => {
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [recentExpanded, setRecentExpanded] = useState(true);

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "projects", label: "Projects", icon: FolderOpen },
  ];

  const recentItems = JSON.parse(localStorage.getItem('researchhub_recent') || '[]').slice(0, 5);

  return (
    <div className={`${isMobile ? 'w-full' : 'w-72'} bg-gradient-to-b from-gray-900 via-gray-850 to-gray-800 text-white flex flex-col h-screen shadow-2xl`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <Beaker size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">ResearchHub Pro</h1>
              <p className="text-xs text-gray-400">By NeuverraX</p>
            </div>
          </div>
          {isMobile && (
            <button onClick={close} className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-700 rounded">
              <X size={20} />
            </button>
          )}
        </div>

        <button
          onClick={() => window.location.href = 'https://neuverrax.com'}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to NeuverraX</span>
        </button>
      </div>

      {currentUser ? (
        <div className="p-4 border-b border-gray-700">
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white shadow">
                {currentUser.displayName?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{currentUser.displayName}</p>
                <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize flex items-center gap-1 ${
                currentUser.subscriptionTier === 'pro' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow' 
                  : 'bg-gray-700 text-gray-300 border border-gray-600'
              }`}>
                {currentUser.subscriptionTier === 'pro' && <Crown size={12} />}
                {currentUser.subscriptionTier}
              </span>
              {currentUser.isStudent && (
                <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded-md text-xs font-semibold">
                  🎓 Student
                </span>
              )}
            </div>
            {currentUser.subscriptionTier === 'free' && (
              <div className="mt-2.5 pt-2.5 border-t border-gray-700">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Daily Queries</span>
                  <span className="text-white font-semibold">
                    {currentUser.queriesUsedToday}/{currentUser.dailyQueryLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((currentUser.queriesUsedToday / currentUser.dailyQueryLimit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={onLoginClick}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 shadow-lg"
          >
            <LogIn size={20} />
            Login / Sign Up
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                if (isMobile) close();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                activeView === item.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}

        <div className="my-2 border-t border-gray-700" />

        <div className="px-4">
          <button
            onClick={() => setRecentExpanded(!recentExpanded)}
            className="w-full flex items-center justify-between text-gray-400 hover:text-white py-2.5 text-sm font-semibold transition"
          >
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>Recent Searches</span>
            </div>
            {recentExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {recentExpanded && (
            <div className="space-y-1 mt-1">
              {recentItems.length > 0 ? recentItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveView('home');
                    if (isMobile) close();
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-700/30 rounded transition truncate"
                >
                  {item.query}
                </button>
              )) : (
                <p className="text-xs text-gray-500 px-2 py-1">No recent searches</p>
              )}
            </div>
          )}
        </div>

        <div className="my-2 border-t border-gray-700" />

        <div className="px-4">
          <button
            onClick={() => setSettingsExpanded(!settingsExpanded)}
            className="w-full flex items-center justify-between text-gray-300 hover:text-white py-2.5 transition"
          >
            <div className="flex items-center gap-3">
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </div>
            {settingsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {settingsExpanded && (
            <div className="space-y-1 ml-3 mt-1">
              <button
                onClick={onSettingsClick}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700/30 rounded transition"
              >
                <User size={16} />
                <span>Personalization</span>
              </button>
              <button
                onClick={onSettingsClick}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700/30 rounded transition"
              >
                <Languages size={16} />
                <span>Language</span>
              </button>
              <button
                onClick={onSettingsClick}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700/30 rounded transition"
              >
                <HelpCircle size={16} />
                <span>Learn More</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 space-y-2">
          <div className="flex items-center justify-between">
            <span>Status</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400">Online</span>
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">© 2025 NeuverraX</p>
      </div>
    </div>
  );
};

// ============================================
// QUERY BOX
// ============================================
const QueryBox = ({ onSubmit, processing, activeMode }) => {
  const [query, setQuery] = useState("");

  const placeholders = {
    literature: "e.g., Impact of climate change on marine ecosystems",
    sources: "e.g., Latest AI regulations in the European Union",
    insights: "e.g., What do experts say about renewable energy adoption?"
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !processing) {
      onSubmit(query, activeMode);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholders[activeMode]}
          className="w-full px-6 py-4 text-gray-800 placeholder-gray-400 focus:outline-none resize-none"
          rows={3}
          disabled={processing}
          maxLength={500}
        />
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {query.length}/500 characters
          </span>
          <button
            type="submit"
            disabled={!query.trim() || processing}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Search size={18} />
                Search
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

// ============================================
// RESULTS PANEL
// ============================================
const ResultsPanel = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Beaker size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Start Your Research</h2>
          <p className="text-gray-600">
            Choose a research mode and enter your query to begin comprehensive analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {results.map((result, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-lg p-6 max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{result.query}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                  result.mode === 'literature' ? 'bg-blue-100 text-blue-700' :
                  result.mode === 'sources' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {result.mode}
                </span>
              </div>
            </div>
          </div>

          {result.loading ? (
            <div className="flex items-center gap-3 text-blue-600">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing your query...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{result.response}</p>
              
              {result.sources && result.sources.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Search size={18} />
                    Sources Found
                  </h4>
                  <ul className="space-y-3">
                    {result.sources.map((source, i) => (
                      <li key={i} className="pb-3 border-b border-gray-200 last:border-0">
                        <a href={source.url} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline font-medium text-sm block mb-1">
                          {source.title}
                        </a>
                        <p className="text-gray-600 text-xs">{source.snippet}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.sections && result.sections.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <FileSearch size={18} />
                    Analysis Sections
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {result.sections.map((section, i) => (
                      <li key={i} className="flex items-center gap-2 text-blue-700">
                        <CheckCircle size={14} />
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================
// AUTH HOOK
// ============================================
const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('researchhub_user');
    if (stored) {
      const user = JSON.parse(stored);
      const today = new Date().toDateString();
      if (user.lastReset !== today && user.subscriptionTier === 'free') {
        user.queriesUsedToday = 0;
        user.lastReset = today;
        localStorage.setItem('researchhub_user', JSON.stringify(user));
      }
      return user;
    }
    return null;
  });

  const login = (userData) => {
    const user = {
      uid: Date.now().toString(),
      email: userData.email,
      displayName: userData.name,
      subscriptionTier: 'free',
      queriesUsedToday: 0,
      dailyQueryLimit: 5,
      totalQueriesAllTime: 0,
      isStudent: userData.isStudent || false,
      lastReset: new Date().toDateString()
    };
    localStorage.setItem('researchhub_user', JSON.stringify(user));
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('researchhub_user');
    setCurrentUser(null);
  };

  const upgradeToPro = () => {
    if (currentUser) {
      const updated = { ...currentUser, subscriptionTier: 'pro' };
      localStorage.setItem('researchhub_user', JSON.stringify(updated));
      setCurrentUser(updated);
      return updated;
    }
  };

  const canMakeQuery = () => {
    if (!currentUser) return false;
    if (currentUser.subscriptionTier === 'pro') return true;
    
    const today = new Date().toDateString();
    if (currentUser.lastReset !== today) {
      const reset = { ...currentUser, queriesUsedToday: 0, lastReset: today };
      localStorage.setItem('researchhub_user', JSON.stringify(reset));
      setCurrentUser(reset);
      return true;
    }
    
    return currentUser.queriesUsedToday < currentUser.dailyQueryLimit;
  };

  const incrementQueryCount = () => {
    if (currentUser) {
      const updated = {
        ...currentUser,
        queriesUsedToday: currentUser.subscriptionTier === 'pro' ? currentUser.queriesUsedToday : currentUser.queriesUsedToday + 1,
        totalQueriesAllTime: currentUser.totalQueriesAllTime + 1
      };
      localStorage.setItem('researchhub_user', JSON.stringify(updated));
      setCurrentUser(updated);
    }
  };

  return { currentUser, login, logout, upgradeToPro, canMakeQuery, incrementQueryCount };
};

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeView, setActiveView] = useState("home");
  const [activeMode, setActiveMode] = useState("literature");
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  const { currentUser, login, logout, upgradeToPro, canMakeQuery, incrementQueryCount } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const mockFetchResponse = async (query, mode) => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    if (mode === "literature") {
      return {
        response: `Comprehensive literature review completed for "${query}". Analysis shows significant research activity in this area with emerging trends in methodology and theoretical frameworks.`,
        sections: [
          "Introduction & Background",
          "Current Research Landscape",
          "Methodological Approaches",
          "Key Findings & Patterns",
          "Critical Analysis",
          "Future Directions"
        ]
      };
    } else if (mode === "sources") {
      return {
        response: `Found relevant sources for "${query}". Sources filtered by AI for relevance and credibility.`,
        sources: [
          {
            title: "Nature - Recent Advances in " + query.substring(0, 30),
            url: "https://nature.com",
            snippet: "Leading peer-reviewed research with breakthrough findings."
          },
          {
            title: "Science Direct - Review of " + query.substring(0, 30),
            url: "https://sciencedirect.com",
            snippet: "Meta-analysis covering 150+ studies."
          }
        ]
      };
    } else {
      return {
        response: `Global expert sentiment analysis for "${query}" reveals diverse perspectives. Consensus shows positive outlook with regional variations.`,
        insights: [
          { region: "North America", sentiment: "Optimistic", confidence: 85 },
          { region: "Europe", sentiment: "Cautiously Positive", confidence: 78 }
        ]
      };
    }
  };

  const handleQuerySubmit = async (query, mode) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    if (!canMakeQuery()) {
      setAlertConfig({
        title: "Query Limit Reached",
        message: `You've used all ${currentUser.dailyQueryLimit} queries today. Upgrade to Pro for unlimited queries!`,
        type: "upgrade",
        onConfirm: () => {
          upgradeToPro();
          setAlertConfig({
            title: "🎉 Upgraded to Pro!",
            message: "You now have unlimited queries!",
            type: "success"
          });
          setShowAlert(true);
        }
      });
      setShowAlert(true);
      return;
    }

    setProcessing(true);

    const placeholderResult = {
      query,
      mode,
      response: "",
      timestamp: Date.now(),
      loading: true
    };

    setResults(prev => [...prev, placeholderResult]);

    const recent = JSON.parse(localStorage.getItem('researchhub_recent') || '[]');
    recent.unshift({ query, mode, timestamp: Date.now() });
    localStorage.setItem('researchhub_recent', JSON.stringify(recent.slice(0, 10)));

    try {
      const response = await mockFetchResponse(query, mode);
      incrementQueryCount();

      setResults(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...placeholderResult,
          ...response,
          loading: false
        };
        return updated;
      });

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpgrade = (reason) => {
    setAlertConfig({
      title: "Upgrade to ResearchHub Pro",
      message: "Unlock all features including Source Discovery and Global Insights!",
      type: "upgrade",
      onConfirm: () => {
        upgradeToPro();
        setAlertConfig({
          title: "🎉 Upgraded Successfully!",
          message: "You now have unlimited access!",
          type: "success"
        });
        setShowAlert(true);
      }
    });
    setShowAlert(true);
  };

  const handleLogout = () => {
    setAlertConfig({
      title: "Logout Confirmation",
      message: "Are you sure you want to logout?",
      type: "confirm",
      onConfirm: () => {
        logout();
        setResults([]);
        setActiveView("home");
      }
    });
    setShowAlert(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 p-3 bg-gray-900 text-white rounded-lg shadow-2xl"
        >
          <Menu size={24} />
        </button>
      )}

      {(sidebarOpen || !isMobile) && (
        <div className={`${isMobile ? 'fixed inset-0 z-50' : 'relative'}`}>
          {isMobile && (
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div className={`${isMobile ? 'absolute left-0 top-0 bottom-0' : 'relative h-full'}`}>
            <Sidebar
              close={() => setSidebarOpen(false)}
              onSettingsClick={() => setSettingsOpen(true)}
              activeView={activeView}
              setActiveView={(view) => {
                setActiveView(view);
                if (isMobile) setSidebarOpen(false);
              }}
              currentUser={currentUser}
              onLoginClick={() => setAuthModalOpen(true)}
              isMobile={isMobile}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col bg-gray-50">
        {activeView === "home" && (
          <>
            {currentUser && (
              <div className="p-4 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow">
                      {currentUser.displayName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{currentUser.displayName}</p>
                      <p className="text-xs text-gray-600">
                        {currentUser.subscriptionTier === 'free' ? (
                          <>Queries: {currentUser.queriesUsedToday}/{currentUser.dailyQueryLimit}</>
                        ) : (
                          <span className="text-blue-600 font-medium flex items-center gap-1">
                            <Crown size={12} /> Pro • Unlimited
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {currentUser.subscriptionTier === 'free' && currentUser.queriesUsedToday < 3 && (
                    <button
                      onClick={() => handleUpgrade('quality')}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-md"
                    >
                      Upgrade to Pro
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="p-4 md:p-6">
              <div className="max-w-5xl mx-auto mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Choose Research Mode</h2>
                <p className="text-gray-600 text-sm mb-4">Select the type of analysis you need</p>
                <ResearchModeSelector 
                  activeMode={activeMode} 
                  setActiveMode={setActiveMode}
                  currentUser={currentUser}
                  onUpgrade={handleUpgrade}
                  isMobile={isMobile}
                />
              </div>
            </div>

            <ResultsPanel results={results} />

            <div className="p-4 md:p-6 bg-white border-t border-gray-200 shadow-lg">
              <QueryBox 
                onSubmit={handleQuerySubmit} 
                processing={processing}
                activeMode={activeMode}
              />
            </div>
          </>
        )}

        {activeView === "dashboard" && (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
              {!currentUser ? (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                  <p className="text-gray-600 mb-4">Please login to view dashboard</p>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow p-6">
                  <p className="text-lg">Welcome, {currentUser.displayName}!</p>
                  <p className="text-gray-600 mt-2">Tier: {currentUser.subscriptionTier}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === "projects" && (
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Projects</h2>
              {results.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-12 text-center">
                  <FolderOpen size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">No projects yet</p>
                  <button
                    onClick={() => setActiveView('home')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold"
                  >
                    Start Researching
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {results.map((result, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow p-6">
                      <h3 className="font-bold text-lg mb-2">{result.query}</h3>
                      <p className="text-sm text-gray-600">{result.response}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {authModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Welcome</h2>
              <button onClick={() => setAuthModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                id="demo-name"
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                id="demo-email"
                className="w-full px-4 py-3 border rounded-lg"
              />
              <label className="flex items-center gap-2">
                <input type="checkbox" id="demo-student" />
                <span className="text-sm">I'm a student</span>
              </label>
              <button
                onClick={() => {
                  const name = document.getElementById('demo-name').value;
                  const email = document.getElementById('demo-email').value;
                  const isStudent = document.getElementById('demo-student').checked;
                  
                  if (name && email) {
                    login({ name, email, isStudent });
                    setAuthModalOpen(false);
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomAlert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
}
