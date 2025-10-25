// src/components/SubscriptionModal.js - Complete Pricing & Upgrade Modal (₹399 pricing)
import React, { useState } from "react";
import { AiOutlineClose, AiOutlineCheck, AiOutlineCrown, AiOutlineTeam, AiOutlineFire } from "react-icons/ai";
import PRICING_CONFIG from "../config/PRICING_CONFIG";

export default function SubscriptionModal({ isOpen, onClose, onSubscribe, currentPlan = "free", reason = "limit", isStudent = false }) {
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly or annual

  if (!isOpen) return null;

  // Get pricing details from centralized config
  const proMonthly = PRICING_CONFIG.getPriceDetails('pro-monthly', isStudent);
  const proAnnual = PRICING_CONFIG.getPriceDetails('pro-annual', isStudent);
  const enterprise = PRICING_CONFIG.getPriceDetails('enterprise', false);

  const plans = {
    free: {
      name: "Research Explorer",
      price: 0,
      period: "forever",
      description: "Perfect for getting started",
      features: [
        `${PRICING_CONFIG.FREE_DAILY_LIMIT} queries per day`,
        `Basic ${PRICING_CONFIG.FREE_SECTIONS}-section analysis`,
        `${PRICING_CONFIG.FREE_REFERENCES_MAX} references per query`,
        "Clickable citations",
        "Export as text only",
        "7-day query history",
        "Email support (48h)",
        "Watermark on exports"
      ],
      color: "gray"
    },
    pro: {
      name: "Research Professional",
      price: billingCycle === "monthly" ? proMonthly.discounted : proAnnual.discounted,
      originalPrice: billingCycle === "annual" ? proAnnual.originalMonthly : null,
      period: billingCycle === "monthly" ? "month" : "year",
      dailyCost: billingCycle === "monthly" ? proMonthly.dailyCost : proAnnual.dailyCost,
      savings: billingCycle === "annual" ? PRICING_CONFIG.formatPrice(proAnnual.savings) : null,
      savingsPercent: billingCycle === "annual" ? Math.round(proAnnual.annualDiscountPercent) : null,
      description: "For serious researchers and PhD students",
      badge: "Most Popular",
      features: [
        "Unlimited queries per day",
        `Enhanced ${PRICING_CONFIG.PRO_SECTIONS}-section analysis`,
        `${PRICING_CONFIG.PRO_REFERENCES_MIN}-${PRICING_CONFIG.PRO_REFERENCES_MAX} references per query`,
        "Priority processing (faster)",
        "Export to PDF, BibTeX, Markdown",
        "Unlimited query history",
        "Save favorite queries",
        "No watermark",
        "Email support (24h)",
        "Advanced citation management",
        "Filter by year, type, venue",
        "Beta features early access"
      ],
      valueProps: [
        "💰 Saves 10-15 hours/week",
        "📚 Cheaper than 1 textbook",
        "🎓 Perfect for PhD journey",
        `⚡ Only ${PRICING_CONFIG.formatPrice(proMonthly.dailyCost)}/day`
      ],
      color: "blue",
      icon: AiOutlineCrown
    },
    enterprise: {
      name: "Research Institution",
      price: enterprise.discounted,
      period: "year",
      seats: `${enterprise.seats} seats`,
      perSeatDisplay: `${PRICING_CONFIG.formatPrice(enterprise.perSeatMonthly)}/seat/month`,
      description: "For universities and research teams",
      features: [
        "Everything in Pro, plus:",
        "Team collaboration workspace",
        "Shared query library",
        "Admin dashboard & analytics",
        "Team member management",
        "Custom integrations (Zotero, Notion)",
        "Dedicated account manager",
        "Priority support (4h response)",
        "Training sessions for team",
        "Custom branding option",
        "SSO integration available",
        "Invoice & PO support",
        "API access (add-on)",
        "White-label option (add-on)"
      ],
      color: "purple",
      icon: AiOutlineTeam
    }
  };

  const reasonMessages = {
    limit: {
      title: "🎯 You've Reached Your Daily Limit!",
      message: `You've used all ${PRICING_CONFIG.FREE_DAILY_LIMIT} free queries today. Upgrade to Pro for unlimited access!`,
      highlight: "Your queries reset in: 18 hours 32 minutes"
    },
    feature: {
      title: "🌟 Unlock Pro Features",
      message: "This feature is available in Pro and Enterprise plans only.",
      highlight: "Upgrade now to access advanced research tools"
    },
    quality: {
      title: "📚 Get Enhanced Analysis",
      message: `Pro users get ${PRICING_CONFIG.PRO_SECTIONS} comprehensive sections and ${PRICING_CONFIG.PRO_REFERENCES_MIN}-${PRICING_CONFIG.PRO_REFERENCES_MAX} references per query.`,
      highlight: "You're getting limited results with the free plan"
    }
  };

  const currentReason = reasonMessages[reason] || reasonMessages.limit;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">{currentReason.title}</h2>
              <p className="text-blue-100 text-lg">{currentReason.message}</p>
              {currentReason.highlight && (
                <div className="mt-3 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p className="text-sm font-medium">{currentReason.highlight}</p>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
        </div>

        {/* Today's Value (for limit reason) */}
        {reason === "limit" && (
          <div className="bg-yellow-50 border-b border-yellow-200 p-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-2">📊 What You've Accomplished Today:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⏱️</span>
                  <div>
                    <p className="font-semibold text-gray-800">12+ hours saved</p>
                    <p className="text-gray-600">on manual literature review</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p className="font-semibold text-gray-800">75+ papers cited</p>
                    <p className="text-gray-600">with authentic references</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="font-semibold text-gray-800">₹2,400+ value</p>
                    <p className="text-gray-600">in comprehensive analysis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Toggle */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex justify-center">
            <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-md font-medium transition ${
                  billingCycle === "monthly"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-6 py-2 rounded-md font-medium transition relative ${
                  billingCycle === "annual"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Annual
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                  Save {proAnnual.savingsPercent}%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Free Plan */}
            <div className="border-2 border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{plans.free.name}</h3>
                <div className="text-4xl font-bold text-gray-800 mb-1">Free</div>
                <p className="text-gray-600 text-sm">{plans.free.description}</p>
              </div>

              {currentPlan === "free" && (
                <div className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center font-medium mb-4">
                  Current Plan
                </div>
              )}

              <ul className="space-y-3 mb-6">
                {plans.free.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <AiOutlineCheck className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Plan - Highlighted */}
            <div className="border-4 border-blue-500 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-2xl transition transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-1 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                  <AiOutlineFire />
                  {plans.pro.badge}
                </span>
              </div>

              <div className="text-center mb-4 mt-2">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <AiOutlineCrown className="text-yellow-500" />
                  {plans.pro.name}
                </h3>
                <div className="mb-2">
                  <div className="text-5xl font-bold text-blue-600">
                    {PRICING_CONFIG.formatPrice(plans.pro.price)}
                  </div>
                  <div className="text-gray-600">per {plans.pro.period}</div>
                  {plans.pro.originalPrice && (
                    <div className="text-sm mt-1">
                      <span className="line-through text-gray-400">
                        {PRICING_CONFIG.formatPrice(plans.pro.originalPrice)}
                      </span>
                      <span className="ml-2 text-green-600 font-semibold">{plans.pro.savings}</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-600 mt-1">
                    Just {PRICING_CONFIG.formatPrice(plans.pro.dailyCost)}/day
                  </div>
                  {isStudent && (
                    <div className="mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold inline-block">
                      🎓 Student Discount Applied (40% off)
                    </div>
                  )}
                </div>
                <p className="text-gray-700 text-sm">{plans.pro.description}</p>
              </div>

              <button
                onClick={() => onSubscribe(billingCycle === "monthly" ? "pro-monthly" : "pro-annual")}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition mb-4 flex items-center justify-center gap-2 shadow-lg"
              >
                <AiOutlineCrown />
                Upgrade to Pro
              </button>

              {/* Value Props */}
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 mb-4 border border-blue-200">
                <p className="font-semibold text-gray-800 text-sm mb-2">💎 Why Pro is Worth It:</p>
                {plans.pro.valueProps.map((prop, idx) => (
                  <p key={idx} className="text-xs text-gray-700 mb-1">{prop}</p>
                ))}
              </div>

              <ul className="space-y-2">
                {plans.pro.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <AiOutlineCheck className="text-blue-600 mt-0.5 flex-shrink-0 font-bold" />
                    <span className="text-gray-800 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="border-2 border-purple-200 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  <AiOutlineTeam className="text-purple-600" />
                  {plans.enterprise.name}
                </h3>
                <div className="text-4xl font-bold text-purple-600 mb-1">
                  {PRICING_CONFIG.formatPrice(plans.enterprise.price)}
                </div>
                <div className="text-gray-600 text-sm">per {plans.enterprise.period}</div>
                <div className="text-sm text-gray-600 mb-1">{plans.enterprise.seats}</div>
                <div className="text-xs text-green-600 font-semibold">{plans.enterprise.perSeatDisplay}</div>
                <p className="text-gray-700 text-sm mt-2">{plans.enterprise.description}</p>
              </div>

              <button
                onClick={() => onSubscribe("enterprise")}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition mb-4"
              >
                Contact Sales
              </button>

              <ul className="space-y-2">
                {plans.enterprise.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <AiOutlineCheck className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-600 mb-4">
              💚 <span className="font-semibold">Join 1,000+ researchers</span> from IITs, IISc, and top institutions
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span>✓ Trusted by PhD students</span>
              <span>✓ Used at 50+ universities</span>
              <span>✓ 10,000+ queries completed</span>
              <span>✓ 4.9/5 rating</span>
            </div>
          </div>
        </div>

        {/* Student Discount Banner */}
        {!isStudent && (
          <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="font-bold text-lg mb-1">🎓 Student Discount Available!</p>
              <p className="text-sm">Get 40% off Pro with valid .edu.in or .ac.in email</p>
              <p className="text-xs mt-1 opacity-90">
                Pro Monthly: {PRICING_CONFIG.formatPrice(PRICING_CONFIG.PRO_MONTHLY)} → {PRICING_CONFIG.formatPrice(PRICING_CONFIG.PRO_MONTHLY_STUDENT)} | 
                Pro Annual: {PRICING_CONFIG.formatPrice(PRICING_CONFIG.PRO_ANNUAL)} → {PRICING_CONFIG.formatPrice(PRICING_CONFIG.PRO_ANNUAL_STUDENT)}
              </p>
            </div>
          </div>
        )}

        {/* Guarantees */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm">
              <div>
                <div className="text-3xl mb-2">🔒</div>
                <p className="font-semibold text-gray-800">Secure Payment</p>
                <p className="text-gray-600 text-xs">Razorpay encrypted</p>
              </div>
              <div>
                <div className="text-3xl mb-2">💯</div>
                <p className="font-semibold text-gray-800">7-Day Money Back</p>
                <p className="text-gray-600 text-xs">No questions asked</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🚀</div>
                <p className="font-semibold text-gray-800">Instant Activation</p>
                <p className="text-gray-600 text-xs">Start using immediately</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 rounded-b-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Maybe Later
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Questions? Email us at support@neuverrax.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}