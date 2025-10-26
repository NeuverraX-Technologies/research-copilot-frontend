// src/api/fetchAIResponse.js - Production-ready with user-friendly error handling
export async function fetchAIResponse(query) {
  try {
    if (!query || !query.toString().trim()) {
      console.warn("fetchAIResponse: Empty query provided");
      return { 
        summary: "No query provided.", 
        sections: [], 
        references: [],
        keyTerms: [],
        relatedFields: [],
        suggestedCollaborations: [],
        isError: false // Not a server error
      };
    }

    // Enhanced API base URL handling
    const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const endpoint = `${apiBase}/api/query`;
    
    console.log("🔍 Fetching from:", endpoint);
    console.log("📝 Query:", query.substring(0, 100) + "...");

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ query }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log("📡 Response status:", res.status);

    // Handle specific HTTP errors with user-friendly messages
    if (!res.ok) {
      let errText = "Unknown error";
      try {
        errText = await res.text();
        console.error("❌ Backend error response:", errText);
      } catch (e) {
        console.error("❌ Could not read error response");
      }
      
      // Return user-friendly error based on status code
      if (res.status === 429) {
        return {
          summary: "You've reached your daily query limit",
          sections: [
            {
              title: "Upgrade to Continue Your Research",
              content: "You've used all 5 free queries today. Your daily limit will reset at midnight IST.\n\n✨ Upgrade to Pro for:\n• Unlimited queries every day\n• Enhanced 9-section analysis\n• 18-25 references per query\n• Export to PDF & BibTeX\n• Priority processing\n\nClick the 'Upgrade to Pro' button to continue your research journey!"
            }
          ],
          references: [],
          keyTerms: [],
          relatedFields: [],
          suggestedCollaborations: [],
          isError: false // This is expected, not a server error
        };
      }

      if (res.status === 403) {
        return {
          summary: "Account access restricted",
          sections: [
            {
              title: "Need Help?",
              content: "Your account access has been temporarily restricted. This could be due to policy violations or suspicious activity.\n\nPlease contact our support team for assistance:\n📧 support@neuverrax.com\n\nWe're here to help resolve this quickly!"
            }
          ],
          references: [],
          keyTerms: [],
          relatedFields: [],
          suggestedCollaborations: [],
          isError: false // Not a server error
        };
      }

      if (res.status >= 500) {
        return {
          summary: "Our AI assistant is temporarily busy",
          sections: [
            {
              title: "We're Working On It",
              content: "We're experiencing high demand right now. Please try again in a few moments.\n\n💡 Good news: This query won't count against your daily limit!\n\nWhat you can do:\n• Wait 30-60 seconds and try again\n• Try a more specific query\n• Refresh the page\n\nIf this persists, email us at support@neuverrax.com"
            }
          ],
          references: [],
          keyTerms: [],
          relatedFields: [],
          suggestedCollaborations: [],
          isError: true // Flag to NOT count this query
        };
      }
      
      // Generic error for other status codes
      throw new Error(`Server responded with ${res.status}`);
    }

    // Parse response
    let data;
    try {
      data = await res.json();
      console.log("✅ Successfully parsed JSON response");
      console.log("📊 Response summary length:", data?.summary?.length || 0);
      console.log("📚 Number of sections:", data?.sections?.length || 0);
    } catch (parseErr) {
      console.error("❌ JSON parse error:", parseErr);
      return {
        summary: "Something went wrong on our end",
        sections: [
          {
            title: "Temporary Issue",
            content: "We encountered a technical issue processing your request. This won't count against your daily limit.\n\nPlease try again in a moment. If the problem continues, contact support@neuverrax.com"
          }
        ],
        references: [],
        keyTerms: [],
        relatedFields: [],
        suggestedCollaborations: [],
        isError: true // Don't count this query
      };
    }

    // Validate and normalize response structure
    const normalizedResponse = {
      summary: data?.summary || "No summary provided.",
      sections: Array.isArray(data?.sections) ? data.sections : [],
      references: Array.isArray(data?.references) ? data.references : [],
      keyTerms: Array.isArray(data?.keyTerms) ? data.keyTerms : [],
      relatedFields: Array.isArray(data?.relatedFields) ? data.relatedFields : [],
      suggestedCollaborations: Array.isArray(data?.suggestedCollaborations) ? data.suggestedCollaborations : [],
      isError: false // Success!
    };

    console.log("✅ Request completed successfully");
    return normalizedResponse;

  } catch (err) {
    console.error("❌ fetchAIResponse error:", err);
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);

    // User-friendly error messages for network/connection issues
    if (err.name === 'AbortError') {
      return {
        summary: "Request took too long",
        sections: [
          {
            title: "Analysis Timeout",
            content: "Your query is taking longer than expected to process. This sometimes happens with complex research questions.\n\n💡 This won't count against your daily limit!\n\nWhat to try:\n• Simplify your query\n• Be more specific\n• Try again in a moment\n\nNeed help? Email support@neuverrax.com"
          }
        ],
        references: [],
        keyTerms: [],
        relatedFields: [],
        suggestedCollaborations: [],
        isError: true // Don't count this query
      };
    }

    if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError") || err.message.includes("Network request failed")) {
      return {
        summary: "Connection issue detected",
        sections: [
          {
            title: "Please Check Your Internet Connection",
            content: "We're having trouble connecting to our research servers. This could be temporary.\n\n💡 This won't count against your daily limit!\n\nWhat to try:\n• Check your internet connection\n• Refresh the page\n• Try again in 30 seconds\n• Switch to a different network if available\n\nStill not working? Contact support@neuverrax.com"
          }
        ],
        references: [],
        keyTerms: [],
        relatedFields: [],
        suggestedCollaborations: [],
        isError: true // Don't count this query
      };
    }

    // Generic error fallback
    return {
      summary: "Something unexpected happened",
      sections: [
        {
          title: "Temporary Technical Issue",
          content: "We encountered an unexpected error. Don't worry - this won't count against your daily limit.\n\nPlease try again in a moment. If this keeps happening, email us at support@neuverrax.com with details about what you were searching for.\n\nWe apologize for the inconvenience!"
        }
      ],
      references: [],
      keyTerms: [],
      relatedFields: [],
      suggestedCollaborations: [],
      isError: true // Don't count this query
    };
  }
}