// src/components/ResultsPanel.js - Citation-Enhanced Version
import React from "react";
import { 
  AiOutlineFileText, 
  AiOutlineLink, 
  AiOutlineTag, 
  AiOutlineTeam, 
  AiOutlineBranches, 
  AiOutlineBook  // NEW: Added for references section
} from "react-icons/ai";

export default function ResultsPanel({ chatHistory, resultsEndRef }) {
  
  // NEW FUNCTION: Parse and render content with clickable citations
  const renderContentWithCitations = (content, references) => {
    if (!content) return null;
    
    // If no references, just show plain content
    if (!references || references.length === 0) {
      return <div className="whitespace-pre-wrap">{content}</div>;
    }

    // Parse citations in format [Author Year] or [Author et al. Year]
    const citationPattern = /\[([^\]]+?(?:\d{4}))\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = citationPattern.exec(content)) !== null) {
      // Add text before citation
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex, match.index),
          key: `text-${lastIndex}`
        });
      }

      // Add citation
      const citationText = match[1];
      
      // Try to find matching reference by year or author
      const matchingRef = references.find(ref => {
        if (!ref) return false;
        const refYear = ref.year?.toString();
        const refCitation = ref.citation?.toLowerCase() || '';
        const citationLower = citationText.toLowerCase();
        
        return (refYear && citationText.includes(refYear)) || 
               refCitation.includes(citationLower) ||
               citationLower.includes(refCitation.split(' ')[0]); // Match first author
      });

      parts.push({
        type: 'citation',
        content: citationText,
        reference: matchingRef,
        key: `cite-${match.index}`
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex),
        key: `text-${lastIndex}`
      });
    }

    // If no citations found, return plain content
    if (parts.length === 0) {
      return <div className="whitespace-pre-wrap">{content}</div>;
    }

    // Render with clickable citations
    return (
      <div className="whitespace-pre-wrap">
        {parts.map((part) => {
          if (part.type === 'text') {
            return <span key={part.key}>{part.content}</span>;
          } else {
            // Render citation as clickable link
            const hasUrl = part.reference?.url;
            return (
              <a
                key={part.key}
                href={hasUrl ? part.reference.url : '#references-section'}
                target={hasUrl ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="inline-flex items-center mx-0.5 text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors no-underline"
                title={part.reference ? 
                  `${part.reference.title || 'Paper'} - ${part.reference.venue || 'See references'}` : 
                  'See references below'}
                onClick={(e) => {
                  if (!hasUrl) {
                    e.preventDefault();
                    document.getElementById('references-section')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
              >
                [{part.content}]
              </a>
            );
          }
        })}
      </div>
    );
  };

  // Empty state - show welcome screen
  if (!chatHistory || chatHistory.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
        <div className="text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4 text-gray-700">
            Welcome to Research Copilot
          </h2>
          <p className="text-lg mb-6">
            Your AI-powered research assistant with comprehensive citations
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-8">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">📚 Comprehensive Literature Reviews</h3>
              <p className="text-sm text-blue-800">Deep analysis with authentic citations from academic literature</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">🔬 Research Gap Analysis</h3>
              <p className="text-sm text-green-800">Identify unexplored areas cited from recent papers</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">📖 Authentic References</h3>
              <p className="text-sm text-purple-800">Real papers from journals, conferences, and arXiv</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2">💡 Research Brainstorming</h3>
              <p className="text-sm text-orange-800">Explore ideas with cited evidence</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results display
  return (
    <div className="flex-1 overflow-auto mb-6">
      <div className="max-w-6xl mx-auto space-y-8 pb-4">
        {chatHistory.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            
            {/* Query Header */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <AiOutlineFileText className="text-blue-600 text-2xl mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Research Query</h3>
                  <p className="text-gray-700 text-lg">{item.query}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {item.loading && (
              <div className="flex items-center gap-3 text-blue-600 py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-lg">Conducting comprehensive research analysis ...</span>
              </div>
            )}

            {/* Executive Summary with Citations */}
            {!item.loading && item.summary && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-600 rounded"></span>
                  Executive Summary
                </h4>
                <div className="text-gray-700 leading-relaxed text-base bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                  {renderContentWithCitations(item.summary, item.references)}
                </div>
              </div>
            )}

            {/* Main Sections with Inline Citations */}
            {!item.loading && item.sections && item.sections.length > 0 && (
              <div className="space-y-6">
                {item.sections.map((section, secIdx) => (
                  <div key={secIdx} className="border-l-4 border-gray-300 pl-4 hover:border-blue-500 transition-colors">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      {section.title}
                    </h4>
                    <div className="text-gray-700 leading-relaxed text-base">
                      {renderContentWithCitations(section.content, item.references)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ENHANCED: Academic-Style References Section */}
            {!item.loading && item.references && item.references.length > 0 && (
              <div id="references-section" className="mt-8 pt-6 border-t-2 border-gray-300">
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <AiOutlineBook className="text-blue-600 text-2xl" />
                  References ({item.references.length})
                </h4>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <ol className="space-y-4">
                    {item.references.map((ref, i) => {
                      // Handle both string URLs (old format) and object references (new format)
                      const isStringRef = typeof ref === 'string';
                      
                      if (isStringRef) {
                        // Old format: just URL string
                        return (
                          <li key={i} className="flex gap-3 text-sm">
                            <span className="text-gray-600 font-semibold min-w-[2rem]">[{i + 1}]</span>
                            <a
                              href={ref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline break-all flex-1"
                            >
                              {ref}
                            </a>
                          </li>
                        );
                      }
                      
                      // New format: full reference object
                      return (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="text-gray-600 font-semibold min-w-[2rem]">[{i + 1}]</span>
                          <div className="flex-1">
                            {/* Authors and Year */}
                            <div className="font-semibold text-gray-800">
                              {ref.citation || `${ref.authors || 'Unknown'} (${ref.year || 'n.d.'})`}
                            </div>
                            
                            {/* Title */}
                            {ref.title && (
                              <div className="mt-1 italic text-gray-700">
                                "{ref.title}"
                              </div>
                            )}
                            
                            {/* Venue */}
                            {ref.venue && (
                              <div className="text-gray-600 mt-1 flex items-center gap-2">
                                <span>{ref.venue}</span>
                                {ref.type && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                    {ref.type}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            {/* URL */}
                            {ref.url && (
                              <div className="mt-1">
                                <a
                                  href={ref.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline break-all text-xs"
                                >
                                  {ref.url}
                                </a>
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
                
                {/* Reference Statistics */}
                {item.references.some(r => typeof r === 'object' && r.type) && (
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">Total:</span>
                      <span>{item.references.length}</span>
                    </div>
                    {item.references.filter(r => r.type === 'journal').length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Journals:</span>
                        <span>{item.references.filter(r => r.type === 'journal').length}</span>
                      </div>
                    )}
                    {item.references.filter(r => r.type === 'conference').length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Conferences:</span>
                        <span>{item.references.filter(r => r.type === 'conference').length}</span>
                      </div>
                    )}
                    {item.references.filter(r => r.type === 'preprint').length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Preprints:</span>
                        <span>{item.references.filter(r => r.type === 'preprint').length}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Additional Metadata Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
              
              {/* Key Terms */}
              {!item.loading && item.keyTerms && item.keyTerms.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <AiOutlineTag className="text-green-600" />
                    Key Terms & Concepts
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.keyTerms.map((term, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Fields */}
              {!item.loading && item.relatedFields && item.relatedFields.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <AiOutlineBranches className="text-purple-600" />
                    Related Research Fields
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.relatedFields.map((field, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Collaborations */}
              {!item.loading && item.suggestedCollaborations && item.suggestedCollaborations.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <AiOutlineTeam className="text-orange-600" />
                    Suggested Collaborations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.suggestedCollaborations.map((collab, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                      >
                        {collab}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Error State */}
            {!item.loading && item.response && item.response.includes("⚠️") && !item.summary && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                <p className="font-semibold mb-2">Error</p>
                <p className="whitespace-pre-wrap">{item.response}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={resultsEndRef} />
      </div>
    </div>
  );
}