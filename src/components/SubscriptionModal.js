// src/components/SubscriptionModal.js - Direct Razorpay Payment with Custom Alerts
import React, { useState } from "react";
import { AiOutlineClose, AiOutlineCheck, AiOutlineCrown, AiOutlineTeam, AiOutlineFire } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import CustomAlert from "./CustomAlert";

export default function SubscriptionModal({ isOpen, onClose, currentPlan = "free", reason = "limit" }) {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const { currentUser, upgradeToPro } = useAuth();
  
  // Custom alert state
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    paymentId: null,
    onConfirm: null
  });

  const showAlert = (config) => {
    setAlertConfig({ ...config, isOpen: true });
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
  };

  if (!isOpen) return null;

  const isStudent = currentUser?.isStudent || false;

  // Pricing from your config
  const pricing = {
    'pro-monthly': isStudent ? 359 : 599,
    'pro-annual': isStudent ? 3599 : 5999
  };

  const plans = {
    free: {
      name: "Research Explorer",
      price: 0,
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 queries per day",
        "Basic 6-section analysis",
        "Up to 15 references per query",
        "Clickable citations",
        "Export as text only",
        "7-day query history",
        "Email support (48h)"
      ]
    },
    pro: {
      name: "Research Professional",
      price: billingCycle === "monthly" ? pricing['pro-monthly'] : pricing['pro-annual'],
      originalPrice: billingCycle === "annual" ? Math.round(pricing['pro-monthly'] * 12) : null,
      period: billingCycle === "monthly" ? "month" : "year",
      savings: billingCycle === "annual" ? Math.round((pricing['pro-monthly'] * 12) - pricing['pro-annual']) : null,
      description: "For serious researchers and scholars",
      badge: "Most Popular",
      features: [
        "Unlimited queries per day",
        "Enhanced 9-section analysis",
        "18-25 references per query",
        "Priority processing (faster response)",
        "Export to PDF, BibTeX, Markdown",
        "Unlimited query history",
        "Save and organize queries",
        "No watermarks",
        "Email support (24h)",
        "Advanced citation filters",
        "Beta feature access"
      ],
      realityCheck: [
        "✅ Based on GPT-4 analysis capabilities",
        "✅ Actual academic references from training data",
        "✅ Natural language understanding",
        "✅ Priority queue for faster processing",
        "⚠️ References limited to AI training cutoff (Jan 2025)",
        "⚠️ Citations may need manual verification"
      ]
    },
    enterprise: {
      name: "Enterprise",
      price: 29999,
      period: "year",
      seats: "10 seats",
      description: "For companies, universities and research teams",
      features: [
        "Everything in Pro, plus:",
        "Team collaboration workspace",
        "Shared query library",
        "Admin dashboard & analytics",
        "Team member management",
        "Custom integrations",
        "Dedicated account manager",
        "Priority support (4h)",
        "Training sessions",
        "SSO integration",
        "Invoice support"
      ]
    }
  };

  const reasonMessages = {
    limit: {
      title: "🎯 Daily Limit Reached",
      message: "You've used all 5 free queries today. Upgrade to Pro for unlimited access.",
      highlight: "Queries reset at midnight IST"
    },
    feature: {
      title: "🌟 Unlock Pro Features",
      message: "This feature is available in Pro and Enterprise plans.",
      highlight: "Upgrade to access advanced tools"
    },
    quality: {
      title: "📚 Get Enhanced Analysis",
      message: "Pro users get 9 comprehensive sections and up to 25 references per query.",
      highlight: "Free users get 6 sections and up to 15 references"
    }
  };

  const currentReason = reasonMessages[reason] || reasonMessages.limit;

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle payment
  const handleUpgrade = async (selectedPlan) => {
    if (!currentUser) {
      showAlert({
        type: 'error',
        title: 'Login Required',
        message: 'Please login first to upgrade to Pro.',
        confirmText: 'OK'
      });
      return;
    }

    if (selectedPlan === 'enterprise') {
      window.location.href = 'mailto:info@neuverrax.com?subject=Enterprise Plan Inquiry';
      return;
    }

    setLoading(true);

    try {
      const planType = billingCycle === 'monthly' ? 'pro-monthly' : 'pro-annual';
      const amount = plans.pro.price;

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        showAlert({
          type: 'error',
          title: 'Connection Error',
          message: 'Failed to load payment gateway. Please check your internet connection and try again.',
          confirmText: 'OK'
        });
        setLoading(false);
        return;
      }

      // CRITICAL: Get API URL from environment
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Using API URL:', API_URL); // Debug log

      // Create order on backend
      const orderResponse = await fetch(`${API_URL}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          plan: planType,
          userId: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Razorpay payment options
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'NeuverraX',
        description: `Research Copilot Pro - ${billingCycle === 'monthly' ? 'Monthly' : 'Annual'}`,
        image: 'https://neuverrax.com/logo.png',
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            // Verify payment - ALSO use API_URL here
            const verifyResponse = await fetch(`${API_URL}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: planType,
                userId: currentUser.uid,
                email: currentUser.email,
                amount: amount
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Upgrade user locally
              upgradeToPro(planType);
              
              showAlert({
                type: 'payment',
                title: '🎉 Payment Successful!',
                message: "You're now a Pro member! Enjoy unlimited queries and all premium features.",
                paymentId: response.razorpay_payment_id,
                confirmText: 'Start Using Pro',
                onConfirm: () => {
                  onClose();
                  window.location.reload();
                }
              });
              
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            showAlert({
              type: 'error',
              title: 'Verification Failed',
              message: `Payment verification failed. Please contact support@neuverrax.com with your payment ID: ${response.razorpay_payment_id}`,
              confirmText: 'OK'
            });
          }
        },
        prefill: {
          name: currentUser.displayName,
          email: currentUser.email
        },
        notes: {
          plan: planType,
          userId: currentUser.uid
        },
        theme: {
          color: '#667eea'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      showAlert({
        type: 'error',
        title: 'Payment Failed',
        message: 'Failed to initiate payment. Please try again or contact support.',
        confirmText: 'OK'
      });
      setLoading(false);
    }
  };

  return (
    <>
      <CustomAlert 
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        paymentId={alertConfig.paymentId}
        onConfirm={alertConfig.onConfirm}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
      />
      
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
              <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition">
                <AiOutlineClose size={24} />
              </button>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="bg-gray-50 border-b border-gray-200 p-4">
            <div className="max-w-4xl mx-auto flex justify-center">
              <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-6 py-2 rounded-md font-medium transition ${
                    billingCycle === "monthly" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("annual")}
                  className={`px-6 py-2 rounded-md font-medium transition relative ${
                    billingCycle === "annual" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Annual
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Save 17%
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

              {/* Pro Plan */}
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
                    <div className="text-5xl font-bold text-blue-600">₹{plans.pro.price}</div>
                    <div className="text-gray-600">per {plans.pro.period}</div>
                    {plans.pro.originalPrice && (
                      <div className="text-sm mt-1">
                        <span className="line-through text-gray-400">₹{plans.pro.originalPrice}</span>
                        <span className="ml-2 text-green-600 font-semibold">Save ₹{plans.pro.savings}</span>
                      </div>
                    )}
                    <div className="text-sm text-gray-600 mt-1">
                      Just ₹{Math.round(plans.pro.price / (billingCycle === 'monthly' ? 30 : 365))}/day
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
                  onClick={() => handleUpgrade('pro')}
                  disabled={loading || currentPlan === 'pro'}
                  className={`w-full py-3 rounded-lg font-bold transition mb-4 flex items-center justify-center gap-2 shadow-lg ${
                    loading || currentPlan === 'pro'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : currentPlan === 'pro' ? (
                    'Current Plan'
                  ) : (
                    <>
                      <AiOutlineCrown />
                      Upgrade to Pro
                    </>
                  )}
                </button>

                <ul className="space-y-2 mb-4">
                  {plans.pro.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <AiOutlineCheck className="text-blue-600 mt-0.5 flex-shrink-0 font-bold" />
                      <span className="text-gray-800 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Reality Check */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <p className="font-semibold text-gray-800 text-xs mb-2">📋 What This Actually Means:</p>
                  {plans.pro.realityCheck.map((item, idx) => (
                    <p key={idx} className="text-xs text-gray-700 mb-1">{item}</p>
                  ))}
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="border-2 border-purple-200 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                    <AiOutlineTeam className="text-purple-600" />
                    {plans.enterprise.name}
                  </h3>
                  <div className="text-4xl font-bold text-purple-600 mb-1">₹{plans.enterprise.price}</div>
                  <div className="text-gray-600 text-sm">per {plans.enterprise.period}</div>
                  <div className="text-sm text-gray-600 mb-1">{plans.enterprise.seats}</div>
                  <p className="text-gray-700 text-sm mt-2">{plans.enterprise.description}</p>
                </div>

                <button
                  onClick={() => handleUpgrade('enterprise')}
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

          {/* Trust Badges */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm">
                <div>
                  <div className="text-3xl mb-2">🔒</div>
                  <p className="font-semibold text-gray-800">Secure Payment</p>
                  <p className="text-gray-600 text-xs">Razorpay PCI DSS certified</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">⚡</div>
                  <p className="font-semibold text-gray-800">Instant Access</p>
                  <p className="text-gray-600 text-xs">Start using Pro immediately</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">💳</div>
                  <p className="font-semibold text-gray-800">Cancel Anytime</p>
                  <p className="text-gray-600 text-xs">No long-term commitment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 p-4 rounded-b-2xl">
            <div className="max-w-4xl mx-auto text-center">
              <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                Maybe Later
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Questions? Email us at info@neuverrax.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}