"use client";

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const FloatingInputBar = styled.div`
  width: 100%;
  max-width: 680px;
  background: #383434;
  border-radius: 24px;
  box-shadow: 0 2px 16px 0 #0004;
  display: flex;
  // align-items: center;
  flex-direction: column;
  padding: 0 16px;
  margin: 0 auto;
  position: relative;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #8e8ea0;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 4px;
  padding:4px 8px;

  border-radius: 50%;
  transition: background 0.2s, color 0.2s;
  &:hover {
        background: #23242b;
     color: #8e8ea0;
  }
`;

const StyledTextarea = styled.textarea`
  flex: 1;
  min-height: 44px;
  max-height: 200px;
  background: transparent;
  border: none;
  color: #ececf1;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  line-height: 1.5;
  resize: none;
  outline: none;
  padding: 16px 0;
  margin: 0 8px;
  &::placeholder {
    color: #8e8ea0;
    opacity: 1;
  }
`;

const SendButton = styled.button<{ $disabled: boolean }>`
  background: ${(props) => (props.$disabled ? "#23242b" : "#23242b")};
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-left: 8px;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s, transform 0.1s;
  &:hover:not(:disabled) {
    background: #23242b;
    transform: scale(1.08);
  }
  &:active:not(:disabled) {
    background: #23242b;
    transform: scale(0.96);
  }
  
  @keyframes spin {
    to {
      stroke-dashoffset: 0;
    }
  }
`;

interface InputAreaProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading = false }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const isDisabled = !message.trim() || isLoading;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "24px 0 20px 0",
      }}
    >
      <FloatingInputBar>
       
        <StyledTextarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "AI is thinking..." : "Ask anything"}
          rows={1}
          disabled={isLoading}
        />
        <div style={{display:"flex",justifyContent:'space-between' ,paddingBottom:10}}>

         <IconButton title="New chat">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4v12M4 10h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </IconButton>
     <div style={{display:"flex"}}>

        <IconButton title="Voice">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle
              cx="10"
              cy="10"
              r="4"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect x="9" y="5" width="2" height="6" rx="1" fill="currentColor" />
          </svg>
        </IconButton>
        <SendButton
          $disabled={isDisabled}
          onClick={handleSend}
          title="Send message"
          disabled={isDisabled}
        >
          {isLoading ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="9"
                cy="9"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="12.566"
                strokeDashoffset="12.566"
                style={{
                  animation: "spin 1s linear infinite",
                }}
              />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.25 15.75L15.75 9L2.25 2.25V7.5L12 9L2.25 10.5V15.75Z"
                fill="currentColor"
              />
            </svg>
          )}
        </SendButton>
     </div>
        </div>
      </FloatingInputBar>
    </div>
  );
};

export default InputArea;
