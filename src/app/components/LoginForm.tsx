import React, { useState } from "react";
import styled from "styled-components";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #343541;
  color: #ececf1;
  padding: 20px;
`;

const LoginFormWrapper = styled.div`
  background: #40414f;
  border-radius: 8px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 24px;
  color: #ececf1;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #ececf1;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #555;
  background: #2a2b32;
  color: #ececf1;
  font-size: 16px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #10a37f;
  }

  &::placeholder {
    color: #8e8ea0;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #10a37f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #19c37d;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
`;

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  errorMessage?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, errorMessage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateForm = () => {
    let isValid = true;

    // Email validation
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email address is invalid");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      await onLogin(email, password);
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginFormWrapper>
        <Title>Login to Football Daily Prediction</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              placeholder="Enter your email"
            />
            {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              placeholder="Enter your password"
            />
            {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
          </FormGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </form>
      </LoginFormWrapper>
    </LoginContainer>
  );
};

export default LoginForm;
