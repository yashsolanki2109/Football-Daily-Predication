import { useState, useEffect, useCallback } from 'react';
import { saveWeeklyChatToStorage, loadWeeklyChatFromStorage, clearWeeklyChatStorage } from './weeklyStorage';

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  pending?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

export const useWeeklyChatStorage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStorageIndicator, setShowStorageIndicator] = useState(false);

  // Load weekly chat from storage on component mount
  useEffect(() => {
    const storedConversation = loadWeeklyChatFromStorage();
    if (storedConversation) {
      setMessages(storedConversation.messages);
      setShowStorageIndicator(true);
      // Hide indicator after 3 seconds
      setTimeout(() => setShowStorageIndicator(false), 3000);
    }
  }, []);

  // Save weekly chat to storage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const conversation: Conversation = {
        id: "weekly-1",
        title: "Weekly Chat",
        messages,
      };
      saveWeeklyChatToStorage(conversation);
    }
  }, [messages]);

  const addMessage = useCallback((role: "user" | "assistant", content: string, pending = false) => {
    setMessages((prev) => [
      ...prev,
      {
        role,
        content,
        timestamp: new Date(),
        pending,
      },
    ]);
  }, []);

  const updateLastAssistantMessage = useCallback((content: string) => {
    setMessages((prev) => {
      const updated = [...prev];
      // Find the last assistant message
      const lastAssistantIdx = updated.map((m, i) => m.role === "assistant" ? i : -1).filter(i => i !== -1).pop();
      if (lastAssistantIdx !== undefined && lastAssistantIdx !== -1) {
        updated[lastAssistantIdx] = {
          ...updated[lastAssistantIdx],
          content,
          pending: false,
        };
      }
      return updated;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    clearWeeklyChatStorage();
  }, []);

  const conversation: Conversation = {
    id: "weekly-1",
    title: "Weekly Chat",
    messages,
  };

  return {
    messages,
    conversation,
    isLoading,
    setIsLoading,
    addMessage,
    updateLastAssistantMessage,
    clearMessages,
    showStorageIndicator,
  };
}; 