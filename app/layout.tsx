import type { Metadata } from "next";
import {
  ClerkProvider,
} from '@clerk/nextjs'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { Chatbot } from "@/components/chatbot/chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "classroomia mini-projet",
  description: "Whrer the Accumulation of digitale culture Begins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body 
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ToasterProvider />
          <ConfettiProvider />
          {children}
          <Chatbot />
        </body>
      </html>
    </ClerkProvider>
     
  );
}
