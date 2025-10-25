// src/components/CustomAlert.js - Beautiful branded alerts
import React from 'react';
import { AiOutlineCheckCircle, AiOutlineWarning, AiOutlineClose, AiOutlineCrown } from 'react-icons/ai';

export default function CustomAlert({ 
  isOpen, 
  onClose, 
  type = 'success', // 'success', 'error', 'confirm'
  title, 
  message, 
  paymentId = null,
  onConfirm = null,
  confirmText = 'OK',
  cancelText = 'Cancel'
}) {
  if (!isOpen) return null;

  const styles = {
    success: {
      gradient: 'from-green-500 to-emerald-600',
      icon: <AiOutlineCheckCircle size={64} className="text-green-500" />,
      buttonBg: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
    },
    error: {
      gradient: 'from-red-500 to-rose-600',
      icon: <AiOutlineWarning size={64} className="text-red-500" />,
      buttonBg: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
    },
    confirm: {
      gradient: 'from-blue-600 to-purple-600',
      icon: <AiOutlineWarning size={48} className="text-blue-600" />,
      buttonBg: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
    },
    payment: {
      gradient: 'from-blue-600 to-purple-600',
      icon: <AiOutlineCrown size={64} className="text-yellow-500" />,
      buttonBg: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
    }
  };

  const currentStyle = styles[type] || styles.success;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform animate-scale-in">
        {/* Gradient Header */}
        <div className={`bg-gradient-to-r ${currentStyle.gradient} p-6 rounded-t-2xl relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative flex justify-center mb-4">
            {currentStyle.icon}
          </div>
          
          {type === 'payment' && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-semibold">Payment Verified</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {title && (
            <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
              {title}
            </h3>
          )}
          
          {message && (
            <p className="text-gray-600 text-center mb-4 leading-relaxed">
              {message}
            </p>
          )}

          {paymentId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Payment ID</p>
              <p className="text-sm font-mono text-gray-800 break-all">{paymentId}</p>
            </div>
          )}

          {type === 'payment' && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4 border border-blue-200">
              <p className="text-sm text-gray-700 mb-2 font-semibold">✨ Pro Features Unlocked:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>✓ Unlimited queries per day</li>
                <li>✓ Enhanced 9-section analysis</li>
                <li>✓ 18-25 references per query</li>
                <li>✓ Export to PDF & BibTeX</li>
              </ul>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {type === 'confirm' && (
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              className={`flex-1 ${currentStyle.buttonBg} text-white py-3 px-6 rounded-lg font-semibold transition shadow-lg`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this CSS to your global styles or App.css
// @keyframes scale-in {
//   from {
//     opacity: 0;
//     transform: scale(0.9);
//   }
//   to {
//     opacity: 1;
//     transform: scale(1);
//   }
// }
// .animate-scale-in {
//   animation: scale-in 0.3s ease-out;
// }