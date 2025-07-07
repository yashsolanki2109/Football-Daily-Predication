import { useState, useEffect, useCallback } from 'react';
import { saveChatToStorage, loadChatFromStorage, clearChatStorage } from './storage';

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

export const useChatStorage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStorageIndicator, setShowStorageIndicator] = useState(false);

  // Load chat from storage on component mount
  useEffect(() => {
    const storedConversation = loadChatFromStorage();
    if (storedConversation) {
      setMessages(storedConversation.messages);
      setShowStorageIndicator(true);
      // Hide indicator after 3 seconds
      setTimeout(() => setShowStorageIndicator(false), 3000);
    }
  }, []);

  // Save chat to storage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const conversation: Conversation = {
        id: "1",
        title: "Chat",
        messages,
      };
      saveChatToStorage(conversation);
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
    clearChatStorage();
  }, []);

  const conversation: Conversation = {
    id: "1",
    title: "Chat",
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