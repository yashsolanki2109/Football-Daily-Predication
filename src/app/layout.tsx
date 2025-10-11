import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "./lib/registry";
import "./globals.css";
import { AuthProvider } from "./lib/authContext";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Football Daily Prediction",
  description: "A football prediction application with chat interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <StyledComponentsRegistry>
          <AuthProvider>{children}</AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
