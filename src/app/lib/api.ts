export interface ChatResponse {
  answer: string;
  // Add other response fields if needed
}

export const sendChatMessage = async (
  question: string
): Promise<ChatResponse> => {
  try {
    const response = await fetch(
      "https://n8n.srv926513.hstgr.cloud/webhook/chatbot",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
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
    const response = await fetch(
      "https://tekzest.app.n8n.cloud/webhook/chatbot-week",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending weekly chat message:", error);
    throw error;
  }
};
