import React from "react";

export default function SettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>

        {/* Example settings */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Theme</label>
            <select className="w-full p-2 border rounded">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Default Query Mode</label>
            <select className="w-full p-2 border rounded">
              <option>Text</option>
              <option>Audio</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={onClose}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
