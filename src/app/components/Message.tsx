"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";

const MessageRow = styled.div<{ $isUser: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.$isUser ? "flex-end" : "flex-start")};
  padding: 0 0 4px 0;
`;

const BubbleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;
`;

const Bubble = styled.div<{ $isUser: boolean }>`
  background: ${(props) =>
    !props.$isUser
      ? "transparent" // No background for user messages
      : "#303030"}; // Official ChatGPT assistant bubble
  color: #d1d5db;
  border-radius: 12px;
  
  border-bottom-right-radius: ${(props) => (props.$isUser ? "8px" : "12px")};
  border-bottom-left-radius: ${(props) => (!props.$isUser ? "8px" : "12px")};
  box-shadow: ${(props) =>
    props.$isUser
      ? "none" // No shadow for user messages
      : "0 1.5px 4px 0 rgba(0, 0, 0, 0.04)"};
  padding: 0px 24px;  
  max-width: 680px;
  min-width: 60px;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  line-height: 1.7;
  position: relative;
  margin: 4px 0;
  word-break: break-word;
  transition: background 0.3s, color 0.3s, box-shadow 0.3s;
  @media (max-width: 700px) {
    max-width: 98vw;
    font-size: 15px;
    padding: 14px 10px;
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 44px;
  & .markdown {
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    min-height: inherit;
  }
  & pre {
    background: #202123;
    color: #ececf1;
    font-family: "JetBrains Mono", "Fira Mono", "Menlo", "Monaco", "Consolas",
      monospace;
    font-size: 15px;
    border-radius: 6px;
    padding: 16px;
    margin: 12px 0;
    overflow-x: auto;
    line-height: 1.6;
    box-shadow: 0 1px 4px 0 #0002;
  }
  & code {
    background: #27272a;
    color: #f3f3f3;
    font-family: "JetBrains Mono", "Fira Mono", "Menlo", "Monaco", "Consolas",
      monospace;
    font-size: 15px;
    border-radius: 4px;
    padding: 2px 6px;
    margin: 0 2px;
  }
  & pre code {
    background: none;
    color: inherit;
    padding: 0;
    margin: 0;
    font-size: inherit;
    border-radius: 0;
  }
  & ul,
  & ol {
    margin: 8px 0 8px 24px;
    padding: 0;
  }
  & blockquote {
    border-left: 3px solid #10a37f;
    background: #23242b;
    color: #ececf1;
    margin: 12px 0;
    padding: 8px 16px;
    border-radius: 6px;
    font-style: italic;
  }
  & a {
    color: #10a37f;
    text-decoration: underline;
    word-break: break-all;
  }
  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    font-weight: 700;
    margin: 16px 0 8px 0;
    color: #ececf1;
  }
  & table {
    border-collapse: collapse;
    margin: 12px 0;
    width: 100%;
  }
  & th,
  & td {
    border: 1px solid #23242b;
    padding: 6px 12px;
    text-align: left;
  }
  & img {
    max-width: 100%;
    border-radius: 6px;
    margin: 8px 0;
  }
`;

const Avatar = styled.div<{ $isUser: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => (props.$isUser ? "#19c37d" : "#10a37f")};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  margin: ${(props) => (props.$isUser ? "0 0 0 12px" : "0 12px 0 0")};
  box-shadow: 0 2px 8px 0 #10a37f22;
`;

const Actions = styled.div<{ $isUser: boolean }>`
  display: flex;
  gap: 4px;
  position: absolute;
  top: 8px;
  ${(props) => (props.$isUser ? "right: 12px;" : "left: 12px;")}
  z-index: 2;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: #8e8ea0;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #353740;
    color: #10a37f;
  }
  &:active {
    background: #23242b;
    color: #19c37d;
  }
`;

const Timestamp = styled.div`
  color: #8e8ea0;
  font-size: 12px;
  margin-top: 6px;
  text-align: right;
`;

interface MessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  };
}

const icons = {
  copy: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="5"
        width="8"
        height="8"
        rx="2"
        stroke="#8e8ea0"
        strokeWidth="1.5"
      />
      <rect
        x="3"
        y="3"
        width="8"
        height="8"
        rx="2"
        fill="none"
        stroke="#8e8ea0"
        strokeWidth="1.5"
        opacity="0.4"
      />
    </svg>
  ),
  like: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 15.5s6-4.5 6-8.5A3.5 3.5 0 0 0 9 5.5 3.5 3.5 0 0 0 3 7c0 4 6 8.5 6 8.5Z"
        stroke="#8e8ea0"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  ),
  dislike: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 2.5s6 4.5 6 8.5A3.5 3.5 0 0 1 9 12.5 3.5 3.5 0 0 1 3 11c0-4 6-8.5 6-8.5Z"
        stroke="#8e8ea0"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  ),
};

const TYPING_SPEED = 18; // ms per character, similar to ChatGPT

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  const avatarText = isUser ? "🧑" : "🤖";
  const [copied, setCopied] = useState(false);
 
  const [displayed, setDisplayed] = useState(isUser ? message.content : "");

  useEffect(() => {
    
    setDisplayed(message.content);
  }, [message.content, isUser]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <MessageRow $isUser={isUser}>
      {!isUser && <Avatar $isUser={isUser}>{avatarText}</Avatar>}
      <BubbleWrapper>
        
        <Bubble $isUser={isUser}>
          <div className="markdown">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <span {...props} />
              }}
            >
              {displayed}
            </ReactMarkdown>
            {!isUser && displayed.length < message.content.length && (
              <span className="blinking-cursor">|</span>
            )}
          </div>
        </Bubble>
        {/* <Actions $isUser={isUser}>
          <ActionButton onClick={handleCopy} title="Copy">
            {icons.copy}
          </ActionButton>
          {!isUser && (
            <>
              <ActionButton
                onClick={() => {
                  setLiked((v) => !v);
                  setDisliked(false);
                }}
                title="Like"
                style={liked ? { color: "#10a37f" } : {}}
              >
                {icons.like}
              </ActionButton>
              <ActionButton
                onClick={() => {
                  setDisliked((v) => !v);
                  setLiked(false);
                }}
                title="Dislike"
                style={disliked ? { color: "#f33" } : {}}
              >
                {icons.dislike}
              </ActionButton>
            </>
          )}
        </Actions> */}
        <Timestamp>
          {copied ? "Copied!" : formatTime(message.timestamp)}
        </Timestamp>
      </BubbleWrapper>
      {isUser && <Avatar $isUser={isUser}>{avatarText}</Avatar>}
    </MessageRow>
  );
};

export default Message;
