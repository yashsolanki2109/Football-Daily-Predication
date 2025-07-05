"use client";

import React from "react";
import styled from "styled-components";
import ChatInterface from "./components/ChatInterface";
import TopBar from "./components/TopBar";
import DashboardTable from "./components/DashboardTable";
import { sendChatMessage } from "./lib/api";
import { useChatStorage } from "./lib/useChatStorage";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #343541;
  color: #ececf1;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  min-height: 0;
`;

export default function Home() {
  const [activeMenu, setActiveMenu] = React.useState<"dashboard" | "chat">("dashboard");
  const { conversation, isLoading, setIsLoading, addMessage, clearMessages, showStorageIndicator } = useChatStorage();

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message immediately
    addMessage("user", content);
    setIsLoading(true);

    try {
      // Send message to API
      const response = await sendChatMessage(content);
      
      // Add AI response
      addMessage("assistant", response.answer);
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Add error message
      addMessage("assistant", "Sorry, I encountered an error while processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContainer>
      <TopBar active={activeMenu} onSelect={setActiveMenu} onClearChat={clearMessages} />
      <MainContent>
        {activeMenu === "dashboard" ? (
          <DashboardTable />
        ) : (
          <ChatInterface
            conversation={conversation}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            showStorageIndicator={showStorageIndicator}
          />
        )}
      </MainContent>
    </AppContainer>
  );
}
