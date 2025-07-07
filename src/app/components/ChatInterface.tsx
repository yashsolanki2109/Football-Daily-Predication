"use client";

import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import Message from "./Message";
import InputArea from "./InputArea";

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #1f1f1f;
  position: relative;
  width: 100vw;
  overflow: hidden;
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  padding: 0;
  background: #1f1f1f;
  scrollbar-width: thin;
  scrollbar-color: #1f1f1f #444654;
  &::-webkit-scrollbar {
    width: 8px;
    background: #1f1f1f;
  }
  &::-webkit-scrollbar-thumb {
    background: #1f1f1f;
    border-radius: 8px;
  }
`;

const MessageColumn = styled.div`
  width: 100%;
  max-width: 680px;
  padding: 32px 16px 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // height: 60vh;
  color: #ececf1;
  text-align: center;
`;

const EmptyStateTitle = styled.h2`
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 12px;
  font-family: "Inter", sans-serif;
`;

const EmptyStateSubtitle = styled.p`
  font-size: 16px;
  color: #8e8ea0;
  margin-bottom: 20px;
  font-family: "Inter", sans-serif;
`;

const CenteredContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

interface ChatInterfaceProps {
  conversation?: Conversation;
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  showStorageIndicator?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversation,
  onSendMessage,
  isLoading = false,
  showStorageIndicator = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      onSendMessage(content);
    }
  };

  return (
    <ChatContainer>
      {conversation?.messages && conversation.messages.length > 0 ? (
        <>
          <MessagesArea>
            <MessageColumn>
              {showStorageIndicator && (
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: '12px', 
                  color: '#8e8ea0', 
                  marginBottom: '16px',
                  fontStyle: 'italic'
                }}>
                  Messages loaded from recent chat history
                </div>
              )}
              {conversation.messages.map((message, index) => {
                // Find the last assistant message index
                const lastAssistantIndex = conversation.messages
                  .map((msg, i) => (msg.role === "assistant" ? i : -1))
                  .filter(i => i !== -1)
                  .pop();
                const isTyping = isLoading && index === lastAssistantIndex;
                return (
                  <Message key={index} message={message} isTyping={isTyping} />
                );
              })}
              <div ref={messagesEndRef} />
            </MessageColumn>
          </MessagesArea>
          <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
        </>
      ) : (
        <CenteredContent>
          <EmptyState>
            <EmptyStateTitle>What can I help with?</EmptyStateTitle>
            <EmptyStateSubtitle>
              {/* I&apos;m an AI assistant ready to help with your questions and
              tasks. */}
            </EmptyStateSubtitle>
          </EmptyState>
            <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
        </CenteredContent>
      )}
    </ChatContainer>
  );
};

export default ChatInterface;
