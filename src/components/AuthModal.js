// src/components/AuthModal.js - Login/Signup Modal
import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMail, AiOutlineLock, AiOutlineUser, AiOutlineGoogle } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!displayName.trim()) {
          throw new Error('Please enter your name');
        }
        await signup(email, password, displayName);
      } else {
        await login(email, password);
      }
      
      // Close modal on success
      onClose();
      
      // Reset form
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isStudentEmail = email.endsWith('.edu.in') || email.endsWith('.ac.in');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            <AiOutlineClose size={20} />
          </button>
          <h2 className="text-2xl font-bold mb-2">
            {mode === 'login' ? 'Welcome Back!' : 'Join Research Copilot'}
          </h2>
          <p className="text-blue-100 text-sm">
            {mode === 'login' 
              ? 'Login to continue your research journey' 
              : 'Start your research journey today'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Student Email Notice */}
          {mode === 'signup' && isStudentEmail && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4 text-sm">
              🎓 <strong>Student Email Detected!</strong> You'll get 40% off Pro plans!
            </div>
          )}

          {/* Name (Signup only) */}
          {mode === 'signup' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Full Name
              </label>
              <div className="relative">
                <AiOutlineUser className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email Address
            </label>
            <div className="relative">
              <AiOutlineMail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {mode === 'signup' && (
              <p className="text-xs text-gray-500 mt-1">
                Use .edu.in or .ac.in email for 40% student discount
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <AiOutlineLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
            {mode === 'signup' && (
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 characters
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={() => setError('Google Sign-In coming soon!')}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <AiOutlineGoogle size={20} />
            Google
          </button>

          {/* Toggle Mode */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className="ml-2 text-blue-600 font-semibold hover:text-blue-700"
            >
              {mode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </form>

        {/* Features (Signup only) */}
        {mode === 'signup' && (
          <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">What you get for free:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>✓ 5 comprehensive research queries daily</li>
              <li>✓ AI-powered citations from academic papers</li>
              <li>✓ 10-15 authentic references per query</li>
              <li>✓ Export and save your research</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}