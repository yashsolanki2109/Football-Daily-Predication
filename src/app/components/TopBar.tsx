import React from "react";
import styled from "styled-components";

const Bar = styled.nav`
  width: 100%;
  background: #1f1f1f;
  /* border-bottom: 1px solid #40414f; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  box-shadow: 0 1.5px 4px 0 rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 10;
  transition: background 0.3s, box-shadow 0.3s;
  @media (max-width: 600px) {
    padding: 0 8px;
    height: 48px;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;


const AppName = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #ececf1;
  letter-spacing: 1px;
  font-family: "Inter", sans-serif;
  @media (max-width: 600px) {
    font-size: 15px;
  }
`;

const Center = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const Menu = styled.ul`
  display: flex;
  gap: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li<{ $active: boolean }>`
  color: ${(props) => (props.$active ? "#fff" : "#ececf1")};
  font-weight: ${(props) => (props.$active ? 700 : 500)};
  font-size: 15px;
  cursor: pointer;
  padding: 7px 16px;
  border-radius: 10px;
  background: ${(props) =>
    props.$active ? "rgba(16,163,127,0.18)" : "transparent"};
  box-shadow: ${(props) => (props.$active ? "0 2px 8px 0 #10a37f22" : "none")};
  border: none;
  outline: none;
  transition: color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.1s;
  &:hover {
    color: #fff;
    background: rgba(25, 195, 125, 0.18);
    box-shadow: 0 2px 8px 0 #19c37d22;
  }
  &:active {
    transform: scale(0.96);
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClearButton = styled.button`
  background: transparent;
  border: 1px solid #444654;
  color: #ececf1;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #444654;
    border-color: #19c37d;
    color: #19c37d;
  }
  &:active {
    transform: scale(0.95);
  }
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #10a37f;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  border: 2px solid #19c37d44;
  margin-left: 10px;
  box-shadow: 0 2px 8px 0 #10a37f11;
  transition: box-shadow 0.2s, transform 0.1s;
  cursor: pointer;
  &:hover {
    box-shadow: 0 4px 16px 0 #10a37f33;
  }
  &:active {
    transform: scale(0.95);
  }
`;



interface TopBarProps {
  active: "dashboard" | "chat";
  onSelect: (menu: "dashboard" | "chat") => void;
  onClearChat?: () => void;
}




const TopBar: React.FC<TopBarProps> = ({ active, onSelect, onClearChat }) => {
 

  return (
    <Bar>
      <Left>

        <AppName>{active === 'dashboard' ? 'Daily Predictions' : 'Chat'}</AppName>
        
      </Left>
      <Center>
        <Menu>
          <MenuItem
            $active={active === "dashboard"}
            onClick={() => onSelect("dashboard")}
          >
            Dashboard
          </MenuItem>
          <MenuItem
            $active={active === "chat"}
            onClick={() => onSelect("chat")}
          >
            Chat
          </MenuItem>
        </Menu>
      </Center>
      <Right>
        {active === "chat" && onClearChat && (
          <ClearButton onClick={onClearChat} title="Clear chat history">
            Clear
          </ClearButton>
        )}
        <Avatar title="User">🧑</Avatar>
      </Right>
    </Bar>
  );
};

export default TopBar;
