// src/api/fetchAIResponse.js - Production-ready with comprehensive error handling
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
        suggestedCollaborations: []
      };
    }

    // Enhanced API base URL handling
    const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:5000";
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

    if (!res.ok) {
      let errText = "Unknown error";
      try {
        errText = await res.text();
        console.error("❌ Backend error response:", errText);
      } catch (e) {
        console.error("❌ Could not read error response");
      }
      
      throw new Error(`Server responded with ${res.status}: ${errText}`);
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
      const rawText = await res.text();
      console.error("Raw response:", rawText.substring(0, 500));
      throw new Error("Failed to parse server response as JSON");
    }

    // Validate and normalize response structure
    const normalizedResponse = {
      summary: data?.summary || "No summary provided.",
      sections: Array.isArray(data?.sections) ? data.sections : [],
      references: Array.isArray(data?.references) ? data.references : [],
      keyTerms: Array.isArray(data?.keyTerms) ? data.keyTerms : [],
      relatedFields: Array.isArray(data?.relatedFields) ? data.relatedFields : [],
      suggestedCollaborations: Array.isArray(data?.suggestedCollaborations) ? data.suggestedCollaborations : []
    };

    console.log("✅ Request completed successfully");
    return normalizedResponse;

  } catch (err) {
    console.error("❌ fetchAIResponse error:", err);
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);

    // Provide specific error messages based on error type
    let errorMessage = "⚠️ Failed to fetch AI response. ";
    let errorDetails = "";

    if (err.name === 'AbortError') {
      errorMessage = "⚠️ Request timed out. ";
      errorDetails = "The server took too long to respond. This might be due to complex analysis. Please try a more specific query or try again.";
    } else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
      errorMessage = "⚠️ Network error. ";
      errorDetails = "Cannot connect to the server. Please ensure:\n1. Backend server is running (check http://localhost:5000/health)\n2. CORS is configured correctly\n3. No firewall is blocking the connection";
    } else if (err.message.includes("JSON")) {
      errorMessage = "⚠️ Invalid server response. ";
      errorDetails = "The server returned malformed data. This might be an OpenAI API issue or prompt parsing problem. Check server logs.";
    } else if (err.message.includes("500")) {
      errorMessage = "⚠️ Server error. ";
      errorDetails = "The backend encountered an error. This is likely an OpenAI API issue. Check:\n1. API key is valid\n2. You have sufficient credits\n3. Server console for detailed logs";
    } else if (err.message.includes("401") || err.message.includes("403")) {
      errorMessage = "⚠️ Authentication error. ";
      errorDetails = "OpenAI API key is invalid or missing. Check your .env file.";
    } else {
      errorDetails = `Error: ${err.message}`;
    }

    return {
      summary: errorMessage + errorDetails,
      sections: [
        {
          title: "Troubleshooting Steps",
          content: `1. Check if backend server is running: http://localhost:5000/health
2. Verify your .env file contains: OPENAI_API_KEY=your-key-here
3. Check browser console (F12) for detailed error logs
4. Check backend terminal for server-side errors
5. Ensure you have OpenAI API credits available

Error Details:
${err.message}

If the problem persists, please check:
- Backend server logs
- OpenAI API dashboard for quota/billing issues
- Network connectivity`
        }
      ],
      references: [],
      keyTerms: [],
      relatedFields: [],
      suggestedCollaborations: []
    };
  }
}