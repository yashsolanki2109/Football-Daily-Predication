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

const WEEKLY_CHAT_STORAGE_KEY = 'weekly-chatgpt-ui-chat-history';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

export const saveWeeklyChatToStorage = (conversation: {
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
    const oneWeekAgo = new Date(now.getTime() - ONE_WEEK_MS);
    
    // Filter messages from the last week
    const recentMessages = conversation.messages.filter(
      message => message.timestamp >= oneWeekAgo
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

    localStorage.setItem(WEEKLY_CHAT_STORAGE_KEY, JSON.stringify(storedConversation));
  } catch (error) {
    console.error('Error saving Pre-Day chat to localStorage:', error);
  }
};

export const loadWeeklyChatFromStorage = (): {
  id: string;
  title: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>;
} | null => {
  try {
    const stored = localStorage.getItem(WEEKLY_CHAT_STORAGE_KEY);
    if (!stored) return null;

    const storedConversation: StoredConversation = JSON.parse(stored);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - ONE_WEEK_MS);
    const lastUpdated = new Date(storedConversation.lastUpdated);

    // Check if the stored conversation is still within 1 week
    if (lastUpdated < oneWeekAgo) {
      // Clear expired data
      localStorage.removeItem(WEEKLY_CHAT_STORAGE_KEY);
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
    console.error('Error loading Pre-Day chat from localStorage:', error);
    return null;
  }
};

export const clearWeeklyChatStorage = () => {
  try {
    localStorage.removeItem(WEEKLY_CHAT_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing Pre-Day chat from localStorage:', error);
  }
}; 