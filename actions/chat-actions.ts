"use server"

import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

interface ChatResponse {
  recipient_id: string
  text: string
}

export async function sendChatMessage(message: string) {
  try {
    // Get or create a session ID for this user
    const cookieStore = cookies()
    const sessionId = (await cookieStore).get("chat_session_id")?.value || uuidv4()

    // Set the cookie if it's new
    if (!(await cookieStore).get("chat_session_id")) {
      (await cookieStore).set("chat_session_id", sessionId, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })
    }

    // For server actions, we need to use the full URL for fetch
    const origin = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const apiUrl = `${origin}/api/chatbot`

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          senderId: sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const responses = await response.json() as ChatResponse[]

      // Combine all responses from Rasa into a single message
      if (responses && responses.length > 0) {
        const combinedResponse = responses
          .map((response) => response.text)
          .filter(Boolean)
          .join("\n\n")

        return combinedResponse || "Je ne sais pas comment vous répondre."
      }

      return "Je n'ai pas reçu de réponse. Veuillez réessayer plus tard."
    } catch (fetchError) {
      console.error("Error fetching from chatbot API:", fetchError)
      return "Une erreur de connexion s'est produite. Veuillez réessayer plus tard."
    }
  } catch (error) {
    console.error("Error in chat completion:", error)
    return "Désolé, j'ai rencontré une erreur. Veuillez réessayer plus tard."
  }
}
