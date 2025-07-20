"use client";

import React from "react";
import styled from "styled-components";
import ChatInterface from "./components/ChatInterface";
import TopBar from "./components/TopBar";
import DashboardTable from "./components/DashboardTable";
import { sendChatMessage, sendWeeklyChatMessage } from "./lib/api";
import { useChatStorage } from "./lib/useChatStorage";
import { useWeeklyChatStorage } from "./lib/useWeeklyChatStorage";
import WeeklyDashboardTable from "./components/WeeklyDashboardTable";
import WeeklyChatInterface from "./components/WeeklyChatInterface";

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
  const [activeMenu, setActiveMenu] = React.useState<"dashboard" | "chat" | 'weekly_dashboard' | "weekly_chat">("dashboard");
  const {
    conversation,
    isLoading,
    setIsLoading,
    addMessage,
    updateLastAssistantMessage,
    clearMessages,
    showStorageIndicator
  } = useChatStorage();

  const {
    conversation: weeklyConversation,
    isLoading: weeklyIsLoading,
    setIsLoading: setWeeklyIsLoading,
    addMessage: addWeeklyMessage,
    updateLastAssistantMessage: updateLastWeeklyAssistantMessage,
    clearMessages: clearWeeklyMessages,
    showStorageIndicator: weeklyShowStorageIndicator
  } = useWeeklyChatStorage();

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    addMessage("user", content);
    addMessage("assistant", "", true);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(content);
      const answer = response.answer;

      for (let i = 1; i <= answer.length; i++) {
        setTimeout(() => {
          updateLastAssistantMessage(answer.slice(0, i));
        }, i * 20);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, answer.length * 20 + 100);
    } catch (error) {
      console.log("You got the error", error)
      updateLastAssistantMessage("Sorry, I encountered an error while processing your request. Please try again.");
      setIsLoading(false);
    }
  };

  const handleWeeklySendMessage = async (content: string) => {
    if (!content.trim()) return;

    addWeeklyMessage("user", content);
    addWeeklyMessage("assistant", "", true);
    setWeeklyIsLoading(true);

    try {
      const response = await sendWeeklyChatMessage(content);
      const answer = response.answer;

      for (let i = 1; i <= answer.length; i++) {
        setTimeout(() => {
          updateLastWeeklyAssistantMessage(answer.slice(0, i));
        }, i * 20);
      }
      setTimeout(() => {
        setWeeklyIsLoading(false);
      }, answer.length * 20 + 100);
    } catch (error) {
      console.log("You got the error", error)
      updateLastWeeklyAssistantMessage("Sorry, I encountered an error while processing your request. Please try again.");
      setWeeklyIsLoading(false);
    }
  };

  return (
    <AppContainer>
      <TopBar 
        active={activeMenu} 
        onSelect={setActiveMenu} 
        onClearChat={clearMessages}
        onClearWeeklyChat={clearWeeklyMessages}
      />
      <MainContent>
        {activeMenu === "dashboard" ? (
          <DashboardTable />
        ) : activeMenu === 'weekly_dashboard' ? (
          <WeeklyDashboardTable />
        ) : activeMenu === 'weekly_chat' ? (
          <WeeklyChatInterface
            conversation={weeklyConversation}
            onSendMessage={handleWeeklySendMessage}
            isLoading={weeklyIsLoading}
            showStorageIndicator={weeklyShowStorageIndicator} />
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
