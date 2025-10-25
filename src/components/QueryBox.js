// src/components/QueryBox.js - Enhanced with research examples
import React, { useState } from "react";
import { AiOutlinePaperClip, AiOutlineAudio, AiOutlineSend } from "react-icons/ai";

export default function QueryBox({ onSubmit, processing = false }) {
  const [text, setText] = useState("");
  const [showExamples, setShowExamples] = useState(false);

  const exampleQueries = [
    "Controller placement problem in software-defined networks — comprehensive literature review and research gaps",
    "Federated learning privacy-preserving techniques: state-of-the-art methods and open challenges",
    "Quantum computing applications in drug discovery: current progress and future directions",
    "Transfer learning for medical image analysis: methodologies, benchmarks, and clinical deployment",
    "Graph neural networks for traffic prediction: comparative analysis and scalability issues"
  ];

  const handleSubmit = () => {
    const q = text.trim();
    if (!q || processing) return;
    onSubmit(q);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleExampleClick = (example) => {
    setText(example);
    setShowExamples(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Example Queries Dropdown */}
      {showExamples && (
        <div className="mb-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Example Research Queries:</h3>
          <div className="space-y-2">
            {exampleQueries.map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(example)}
                className="w-full text-left p-3 hover:bg-blue-50 rounded-lg transition text-sm text-gray-700 border border-gray-200"
              >
                {example}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowExamples(false)}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Close examples
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3">
        <label
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white ${
            processing ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"
          }`}
        >
          <AiOutlinePaperClip className="text-gray-600" />
          <span className="text-sm text-gray-700">Attach PDF</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                alert(`PDF upload feature coming soon: ${file.name}`);
              }
            }}
            className="hidden"
            disabled={processing}
          />
        </label>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white ${
            processing ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
          }`}
          disabled={processing}
          title="Voice input (coming soon)"
          onClick={() => {
            alert("Voice input feature coming soon!");
          }}
        >
          <AiOutlineAudio className="text-gray-600" />
          <span className="text-sm text-gray-700">Voice</span>
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-blue-50 text-sm text-blue-600"
          onClick={() => setShowExamples(!showExamples)}
        >
          💡 Examples
        </button>

        <div className="flex-1" />

        <div className={`text-sm font-medium ${processing ? "text-orange-600" : "text-green-600"}`}>
          {processing ? "🔄 Processing..." : "✓ Ready"}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex items-end gap-3 bg-white rounded-xl shadow-lg border border-gray-200 p-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a research question (e.g., 'Deep learning for climate modeling — literature review, gaps, and future directions')"
          rows={4}
          className="flex-1 p-3 resize-none focus:outline-none text-gray-800 placeholder-gray-400"
          disabled={processing}
        />
        <button
          onClick={handleSubmit}
          disabled={processing || !text.trim()}
          className={`p-4 rounded-lg transition-all ${
            processing || !text.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg"
          }`}
          title={processing ? "Processing..." : "Submit query"}
        >
          <AiOutlineSend size={20} />
        </button>
      </div>

      {/* Tips */}
      <div className="mt-3 text-xs text-gray-500 flex items-center gap-4">
        <span>💡 Tip: Be specific about the research area, desired analysis depth, and key aspects</span>
        <span>•</span>
        <span>Press Enter to submit, Shift+Enter for new line</span>
      </div>
    </div>
  );
}