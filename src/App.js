// src/App.js - Enhanced with Authentication & Subscription Management
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import QueryBox from "./components/QueryBox";
import ResultsPanel from "./components/ResultsPanel";
import SettingsModal from "./components/SettingsModal";
import SubscriptionModal from "./components/SubscriptionModal";
import AuthModal from "./components/AuthModal";
import { fetchAIResponse } from "./api/fetchAIResponse";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("limit"); // limit, feature, quality

  const [activeView, setActiveView] = useState("home");
  const resultsEndRef = useRef(null);
  const [processing, setProcessing] = useState(false);

  const { 
    currentUser, 
    canMakeQuery, 
    incrementQueryCount, 
    upgradeToPro,
    getQueriesRemaining,
    getTimeUntilReset 
  } = useAuth();

  const handleQuerySubmit = async (query) => {
    if (!query || !query.trim() || processing) return;

    // Check if user is logged in
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    // Check if user can make a query
    if (!canMakeQuery()) {
      setUpgradeReason("limit");
      setSubModalOpen(true);
      return;
    }

    setProcessing(true);
    
    // Increment query count
    incrementQueryCount();

    const placeholderItem = {
      query,
      summary: "",
      sections: [],
      references: [],
      keyTerms: [],
      relatedFields: [],
      suggestedCollaborations: [],
      response: "⏳ Research Copilot is conducting comprehensive analysis...",
      timestamp: Date.now(),
      loading: true,
    };
    setChatHistory((prev) => [...prev, placeholderItem]);

    try {
      const result = await fetchAIResponse(query);

      // If free user, limit the response
      let processedResult = result;
      if (currentUser.subscriptionTier === 'free') {
        processedResult = {
          ...result,
          sections: result.sections?.slice(0, 6) || [], // Only 6 sections for free
          references: result.references?.slice(0, 15) || [], // Only 15 references for free
        };
      }

      setChatHistory((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          ...updated[lastIndex],
          summary: processedResult.summary || "",
          sections: processedResult.sections || [],
          references: processedResult.references || [],
          keyTerms: processedResult.keyTerms || [],
          relatedFields: processedResult.relatedFields || [],
          suggestedCollaborations: processedResult.suggestedCollaborations || [],
          response: processedResult.summary || "No response returned from Research Copilot",
          loading: false,
          tier: currentUser.subscriptionTier // Track which tier was used
        };
        return updated;
      });

      // Show upgrade nudge for free users after 3rd query
      if (currentUser.subscriptionTier === 'free' && currentUser.queriesUsedToday === 3) {
        setTimeout(() => {
          // Show a subtle nudge
          console.log("Consider upgrading to Pro for unlimited queries!");
        }, 2000);
      }

    } catch (err) {
      console.error("Error in fetchAIResponse:", err);
      setChatHistory((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          ...updated[lastIndex],
          response: "⚠️ Error: Could not fetch AI response. Please check server logs.",
          loading: false,
        };
        return updated;
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleSubscribe = (plan) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    if (plan === 'enterprise') {
      // Open email client for enterprise inquiries
      window.location.href = 'mailto:enterprise@neuverrax.com?subject=Enterprise Plan Inquiry';
      setSubModalOpen(false);
      return;
    }

    // In production, this would integrate with Razorpay
    // For now, we'll just upgrade the user
    const updatedUser = upgradeToPro(plan);
    
    // Show success message
    alert(`🎉 Successfully upgraded to Pro!\n\nYour new benefits:\n• Unlimited queries per day\n• Enhanced 9-section analysis\n• 18-25 references per query\n• Priority processing\n• Export to PDF, BibTeX, Markdown\n\nEnjoy your research!`);
    
    setSubModalOpen(false);
  };

  useEffect(() => {
    resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const renderContent = () => {
    switch (activeView) {
      case "home":
        return (
          <div className="flex-1 flex flex-col justify-end p-6 w-full bg-gray-50">
            {/* User Status Bar - Smart Display */}
            {currentUser && (
              <div className="mb-4 bg-white rounded-lg shadow-sm p-4 max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {currentUser.displayName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{currentUser.displayName}</p>
                      <p className="text-xs text-gray-600">
                        {currentUser.subscriptionTier === 'free' && (
                          <>
                            Queries today: {currentUser.queriesUsedToday}/{currentUser.dailyQueryLimit}
                          </>
                        )}
                        {currentUser.subscriptionTier === 'pro' && (
                          <span className="text-blue-600 font-medium">Pro • Unlimited queries</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {/* Show upgrade button ONLY if queries < 3 (not pushy yet) */}
                  {currentUser.subscriptionTier === 'free' && currentUser.queriesUsedToday < 3 && (
                    <button
                      onClick={() => {
                        setUpgradeReason("quality");
                        setSubModalOpen(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition"
                    >
                      Upgrade to Pro
                    </button>
                  )}
                </div>

                {/* Smart Warning System - Shows at queries 3-4 only */}
                {currentUser.subscriptionTier === 'free' && currentUser.queriesUsedToday >= 3 && currentUser.queriesUsedToday < 5 && (
                  <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-orange-800">
                        ⚠️ <strong>{5 - currentUser.queriesUsedToday} {5 - currentUser.queriesUsedToday === 1 ? 'query' : 'queries'} remaining today.</strong>
                        {' '}Upgrade to Pro for unlimited queries.
                      </p>
                      <button
                        onClick={() => {
                          setUpgradeReason("limit");
                          setSubModalOpen(true);
                        }}
                        className="ml-4 px-3 py-1 bg-orange-600 text-white rounded text-sm font-semibold hover:bg-orange-700 transition whitespace-nowrap"
                      >
                        Upgrade
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <ResultsPanel chatHistory={chatHistory} resultsEndRef={resultsEndRef} />
            
            {/* Feature Teaser - ONLY at query 4 (strategic timing) */}
            {currentUser && 
             currentUser.subscriptionTier === 'free' && 
             currentUser.queriesUsedToday === 4 && 
             chatHistory.length > 0 && (
              <div className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4 max-w-5xl mx-auto w-full">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">🌟 You're One Query Away from Your Limit!</p>
                    <p className="text-sm text-gray-700 mb-2">Upgrade to Pro to unlock:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✓ <strong>Unlimited queries</strong> every day</li>
                      <li>✓ <strong>3 additional sections</strong> (9 total vs 6)</li>
                      <li>✓ <strong>8-10 more references</strong> per query</li>
                      <li>✓ <strong>Export to PDF</strong> with citations</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setUpgradeReason("quality");
                      setSubModalOpen(true);
                    }}
                    className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition whitespace-nowrap"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            )}

            <QueryBox onSubmit={handleQuerySubmit} processing={processing} />
          </div>
        );

      case "dashboard":
        return (
          <div className="flex-1 p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Research Dashboard</h2>
              
              {!currentUser ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600 mb-4">Please login to view your dashboard</p>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Login / Sign Up
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Queries Today</h3>
                      <p className="text-4xl font-bold text-blue-600">
                        {currentUser.queriesUsedToday}
                        {currentUser.subscriptionTier === 'free' && (
                          <span className="text-lg text-gray-400">/{currentUser.dailyQueryLimit}</span>
                        )}
                      </p>
                      {currentUser.subscriptionTier === 'free' && (
                        <p className="text-xs text-gray-500 mt-2">
                          Resets in {getTimeUntilReset().hours}h {getTimeUntilReset().minutes}m
                        </p>
                      )}
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Account Type</h3>
                      <p className="text-4xl font-bold text-green-600 capitalize">
                        {currentUser.subscriptionTier}
                      </p>
                      {currentUser.isStudent && (
                        <p className="text-xs text-green-600 mt-2">🎓 Student Discount Active</p>
                      )}
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Queries</h3>
                      <p className="text-4xl font-bold text-purple-600">
                        {currentUser.totalQueriesAllTime}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">All time</p>
                    </div>
                  </div>

                  {currentUser.subscriptionTier === 'free' && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
                      <p className="mb-4">Unlock unlimited queries and advanced features</p>
                      <div className="flex gap-4">
                        <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                          <p className="text-sm mb-1">Monthly</p>
                          <p className="text-2xl font-bold">
                            ₹{currentUser.isStudent ? '239' : '399'}
                            <span className="text-sm font-normal">/month</span>
                          </p>
                        </div>
                        <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                          <p className="text-sm mb-1">Annual <span className="text-xs">(Save 17%)</span></p>
                          <p className="text-2xl font-bold">
                            ₹{currentUser.isStudent ? '2,399' : '3,999'}
                            <span className="text-sm font-normal">/year</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSubModalOpen(true)}
                        className="mt-4 w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                      >
                        Upgrade Now
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case "myQueries":
        return (
          <div className="flex-1 p-6 overflow-auto bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Research Archive</h2>
              
              {!currentUser ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600 mb-4">Please login to view your query history</p>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Login / Sign Up
                  </button>
                </div>
              ) : chatHistory.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <p className="text-gray-500 text-lg">No research queries yet.</p>
                  <p className="text-gray-400 mt-2">Start by asking a research question!</p>
                  <button
                    onClick={() => setActiveView("home")}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Start Research
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {chatHistory.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-1">{item.query}</h3>
                          <p className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold capitalize">
                            {item.tier || 'free'}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                            #{index + 1}
                          </span>
                        </div>
                      </div>

                      {item.summary && (
                        <div className="mb-4 p-4 bg-gray-50 rounded border-l-4 border-blue-500">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Summary</p>
                          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{item.summary}</p>
                        </div>
                      )}

                      <div className="flex gap-4 text-sm text-gray-600">
                        {item.sections?.length > 0 && (
                          <span>📄 {item.sections.length} sections</span>
                        )}
                        {item.references?.length > 0 && (
                          <span>📚 {item.references.length} references</span>
                        )}
                        {item.keyTerms?.length > 0 && (
                          <span>🏷️ {item.keyTerms.length} key terms</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {sidebarOpen && (
        <Sidebar
          close={() => setSidebarOpen(false)}
          onSettingsClick={() => setSettingsOpen(true)}
          onUpgradeClick={() => {
            setUpgradeReason("feature");
            setSubModalOpen(true);
          }}
          onLoginClick={() => setAuthModalOpen(true)}
          activeView={activeView}
          setActiveView={setActiveView}
          currentUser={currentUser}
        />
      )}

      {renderContent()}

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <SubscriptionModal
        isOpen={subModalOpen}
        onClose={() => setSubModalOpen(false)}
        onSubscribe={handleSubscribe}
        currentPlan={currentUser?.subscriptionTier || "free"}
        reason={upgradeReason}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="login"
      />
    </div>
  );
}

// Wrap with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;