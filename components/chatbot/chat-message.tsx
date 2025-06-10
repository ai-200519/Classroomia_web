import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export interface ChatMessageProps {
  content: string
  role: "user" | "assistant"
  isLoading?: boolean
}

export function ChatMessage({ content, role, isLoading }: ChatMessageProps) {
  return (
    <div className={cn("flex w-full items-start gap-4 py-4", role === "user" ? "justify-end" : "justify-start")}>
      {role === "assistant" && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/bot-avatar.png" alt="AI Assistant" />
          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
          isLoading && "animate-pulse",
        )}
      >
        {content}
      </div>
      {role === "user" && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
