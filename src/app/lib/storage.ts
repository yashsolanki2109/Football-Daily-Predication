export interface StoredMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO string for serialization
}

export interface StoredConversation {
  id: string;
  title: string;
  messages: StoredMessage[];
  lastUpdated: string;
}

const CHAT_STORAGE_KEY = 'chatgpt-ui-chat-history';
const FIVE_MINUTES_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

export const saveChatToStorage = (conversation: {
  id: string;
  title: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>;
}) => {
  try {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - FIVE_MINUTES_MS);
    
    // Filter messages from the last 5 minutes
    const recentMessages = conversation.messages.filter(
      message => message.timestamp >= fiveMinutesAgo
    );

    // Convert Date objects to ISO strings for storage
    const storedMessages: StoredMessage[] = recentMessages.map(message => ({
      role: message.role,
      content: message.content,
      timestamp: message.timestamp.toISOString(),
    }));

    const storedConversation: StoredConversation = {
      id: conversation.id,
      title: conversation.title,
      messages: storedMessages,
      lastUpdated: now.toISOString(),
    };

    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(storedConversation));
  } catch (error) {
    console.error('Error saving chat to localStorage:', error);
  }
};

export const loadChatFromStorage = (): {
  id: string;
  title: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>;
} | null => {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!stored) return null;

    const storedConversation: StoredConversation = JSON.parse(stored);
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - FIVE_MINUTES_MS);
    const lastUpdated = new Date(storedConversation.lastUpdated);

    // Check if the stored conversation is still within 5 minutes
    if (lastUpdated < fiveMinutesAgo) {
      // Clear expired data
      localStorage.removeItem(CHAT_STORAGE_KEY);
      return null;
    }

    // Convert ISO strings back to Date objects
    const messages = storedConversation.messages.map(message => ({
      role: message.role,
      content: message.content,
      timestamp: new Date(message.timestamp),
    }));

    return {
      id: storedConversation.id,
      title: storedConversation.title,
      messages,
    };
  } catch (error) {
    console.error('Error loading chat from localStorage:', error);
    return null;
  }
};

export const clearChatStorage = () => {
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing chat from localStorage:', error);
  }
}; 