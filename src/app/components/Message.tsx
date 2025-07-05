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







interface MessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  };
}




const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  const avatarText = isUser ? "🧑" : "🤖";
 
  const [displayed, setDisplayed] = useState(isUser ? message.content : "");

  useEffect(() => {
    
    setDisplayed(message.content);
  }, [message.content, isUser]);




  return (
    <MessageRow $isUser={isUser}>
      {!isUser && <Avatar $isUser={isUser}>{avatarText}</Avatar>}
      <BubbleWrapper>
        
        <Bubble $isUser={isUser}>
          <div className="markdown">
            <ReactMarkdown
              components={{
                p: (props) => <span {...props} />
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
   
      </BubbleWrapper>
      {isUser && <Avatar $isUser={isUser}>{avatarText}</Avatar>}
    </MessageRow>
  );
};

export default Message;
