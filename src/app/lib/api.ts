export interface ChatResponse {
  answer: string;
  // Add other response fields if needed
}

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    const tokenData = localStorage.getItem("authToken");
    if (tokenData) {
      try {
        const parsedToken = JSON.parse(tokenData);
        if (new Date(parsedToken.expiry) > new Date()) {
          return parsedToken.token;
        }
      } catch (e) {
        // Invalid token data
        console.warn("Invalid token data in localStorage");
      }
    }
  }
  return null;
};

export const sendChatMessage = async (
  question: string
): Promise<ChatResponse> => {
  try {
    const token = getAuthToken();

    // Include token in the request body
    const requestBody: any = { question };
    if (token) {
      requestBody.token = token;
    }

    const response = await fetch(
      "https://n8n.srv926513.hstgr.cloud/webhook/chatbot",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

export const sendWeeklyChatMessage = async (
  question: string
): Promise<ChatResponse> => {
  try {
    const token = getAuthToken();

    // Include token in the request body
    const requestBody: any = { question };
    if (token) {
      requestBody.token = token;
    }

    const response = await fetch(
      "https://n8n.srv926513.hstgr.cloud/webhook/early-chatbot",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending Pre-Day chat message:", error);
    throw error;
  }
};
