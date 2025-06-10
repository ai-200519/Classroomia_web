"use client"

import { useState, useEffect } from "react"
import { MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatMessage, type ChatMessageProps } from "./chat-message"
import { ChatInput } from "./chat-input"
import { cn } from "@/lib/utils"
import { rasaService } from "@/lib/services/rasa-service"
import { v4 as uuidv4 } from "uuid"

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessageProps[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionInitialized, setSessionInitialized] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")

  // Initialize session ID and welcome message
  useEffect(() => {
    // Get or create session ID from localStorage for client-side persistence
    const storedSessionId = localStorage.getItem("chat_session_id") || uuidv4()
    localStorage.setItem("chat_session_id", storedSessionId)
    setSessionId(storedSessionId)

    if (!sessionInitialized && isOpen) {
      // Add initial welcome message
      setMessages([
        {
          role: "assistant",
          content: "Bonjour ! Je suis votre assistant d'apprentissage. Comment puis-je vous aider aujourd'hui ?",
        },
      ])
      setSessionInitialized(true)
    }
  }, [isOpen, sessionInitialized])

  const handleSendMessage = async (content: string) => {
    // Add user message to chat
    const userMessage: ChatMessageProps = {
      role: "user",
      content,
    }
    setMessages((prev) => [...prev, userMessage])

    // Add loading message
    setIsLoading(true)
    setMessages((prev) => [...prev, { role: "assistant", content: "réfichir...", isLoading: true }])

    try {
      // Use the client-side rasaService for direct communication
      const responses = await rasaService.sendMessage(content, sessionId)

      // Combine all responses from Rasa
      const combinedResponse =
        responses
          .map((response) => response.text || "")
          .filter(Boolean)
          .join("\n\n") || "Je ne sais pas comment je vous vais répondre."

      // Replace loading message with response
      setMessages((prev) =>
        prev.slice(0, -1).concat({
          role: "assistant",
          content: combinedResponse,
        }),
      )
    } catch (error) {
      console.error("Error in chat:", error)
      // Replace loading message with error
      setMessages((prev) =>
        prev.slice(0, -1).concat({
          role: "assistant",
          content: "Désolé, j'ai rencontré une erreur. Veuillez ressayer .",
        }),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 md:w-96 shadow-lg">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat d&apos;assissatant
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>
          <CardContent
            className={cn(
              "p-4 h-[300px] overflow-y-auto flex flex-col gap-4",
              messages.length === 0 && "items-center justify-center",
            )}
          >
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <p>Starting conversation...</p>
              </div>
            ) : (
              messages.map((message, index) => <ChatMessage key={index} {...message} />)
            )}
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          </CardFooter>
        </Card>
      ) : (
        <Button onClick={() => setIsOpen(true)} size="icon" className="h-12 w-12 rounded-full shadow-lg">
          <MessageSquare className="h-6 w-6" />
          <span className="sr-only">Ouvrir chat</span>
        </Button>
      )}
    </div>
  )
}
