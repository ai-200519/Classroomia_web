import { type NextRequest, NextResponse } from "next/server"
import { rasaService } from "@/lib/services/rasa-service"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    // Get or create a session ID for this user
    const cookieStore = cookies()
    let sessionId = (await cookieStore).get("chat_session_id")?.value

    if (!sessionId) {
      sessionId = uuidv4()
      ;(await cookieStore).set("chat_session_id", sessionId, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })
    }

    // Send the message to Rasa
    const responses = await rasaService.sendMessage(message, sessionId)

    // Combine all responses from Rasa
    const combinedResponse = responses
      .map((response) => response.text || "")
      .filter(Boolean)
      .join("\n\n")

    return NextResponse.json({ response: combinedResponse || "I'm not sure how to respond to that." })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
