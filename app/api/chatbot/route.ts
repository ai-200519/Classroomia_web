import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// Comprehensive French fallback responses
const frenchResponses = {
  greetings: [
    "Bonjour ! Je suis votre assistant d'apprentissage. Comment puis-je vous aider aujourd'hui ?",
    "Salut ! Bienvenue sur notre plateforme d'apprentissage. Que puis-je faire pour vous ?",
    "Bonjour ! Je suis là pour vous accompagner dans vos études. Posez-moi vos questions !",
  ],
  farewell: [
    "Au revoir ! Bonne continuation dans vos études !",
    "À bientôt ! N'hésitez pas à revenir si vous avez des questions.",
    "Bonne journée ! Continuez à bien apprendre !",
  ],
  thanks: [
    "Je vous en prie ! C'est un plaisir de vous aider.",
    "Avec plaisir ! Y a-t-il autre chose que je puisse faire pour vous ?",
    "De rien ! Je suis là pour ça.",
  ],
  courses: [
    "Je peux vous aider avec des informations générales sur les cours. De quel cours spécifique aimeriez-vous parler ?",
    "Quel cours vous intéresse ? Je peux vous donner des informations sur le contenu et l'organisation.",
    "Pour des informations détaillées sur un cours, consultez la page du cours ou contactez votre instructeur.",
  ],
  assignments: [
    "Pour les devoirs, consultez la section 'Devoirs' de votre cours. Les dates d'échéance y sont indiquées.",
    "Les informations sur les devoirs sont disponibles dans chaque cours. Vérifiez le calendrier pour les dates importantes.",
    "Vous pouvez trouver tous vos devoirs dans votre tableau de bord étudiant, section 'Mes Devoirs'.",
  ],
  grades: [
    "Vos notes sont disponibles dans le carnet de notes de votre tableau de bord.",
    "Pour consulter vos notes, rendez-vous dans la section 'Mes Notes' de votre profil étudiant.",
    "Les notes sont mises à jour régulièrement par vos instructeurs dans le système de notation.",
  ],
  technical: [
    "Pour les problèmes techniques, essayez d'abord d'actualiser la page. Si le problème persiste, contactez le support technique.",
    "En cas de difficultés techniques, vérifiez votre connexion internet et videz le cache de votre navigateur.",
    "Pour une assistance technique, contactez notre équipe support à support@votrelms.com.",
  ],
  study: [
    "Voici quelques conseils d'étude : planifiez vos sessions, prenez des pauses régulières, et n'hésitez pas à poser des questions.",
    "Pour bien étudier : créez un environnement calme, utilisez des techniques de mémorisation active, et rejoignez des groupes d'étude.",
    "Essayez la technique Pomodoro : 25 minutes d'étude, 5 minutes de pause. Répétez le cycle !",
  ],
  schedule: [
    "Votre emploi du temps est disponible dans votre tableau de bord, section 'Mon Planning'.",
    "Pour consulter vos horaires de cours, rendez-vous dans la section 'Calendrier' de votre profil.",
    "Les horaires peuvent changer, vérifiez régulièrement votre planning dans l'application.",
  ],
  help: [
    "Je suis là pour vous aider ! Posez-moi vos questions sur les cours, les devoirs, ou l'utilisation de la plateforme.",
    "Comment puis-je vous assister ? Je peux vous renseigner sur les études, l'organisation, ou les fonctionnalités de la plateforme.",
    "N'hésitez pas à me poser toutes vos questions. Je ferai de mon mieux pour vous orienter !",
  ],
  default: [
    "C'est une bonne question ! Pour des informations spécifiques, je vous recommande de consulter votre cours ou de contacter votre instructeur.",
    "Je comprends votre demande. Pour des détails précis, vérifiez dans votre tableau de bord ou contactez le support.",
    "Intéressant ! Pour une réponse complète, je vous suggère de consulter les ressources de votre cours.",
  ],
}

function categorizeMessage(message: string): keyof typeof frenchResponses {
  const lowerMessage = message.toLowerCase()

  // Greetings
  if (
    lowerMessage.includes("bonjour") ||
    lowerMessage.includes("salut") ||
    lowerMessage.includes("hello") ||
    lowerMessage.includes("bonsoir") ||
    lowerMessage.includes("hey")
  ) {
    return "greetings"
  }

  // Farewell
  if (
    lowerMessage.includes("au revoir") ||
    lowerMessage.includes("bye") ||
    lowerMessage.includes("à bientôt") ||
    lowerMessage.includes("adieu") ||
    (lowerMessage.includes("salut") && (lowerMessage.includes("à plus") || lowerMessage.includes("ciao")))
  ) {
    return "farewell"
  }

  // Thanks
  if (lowerMessage.includes("merci") || lowerMessage.includes("thank")) {
    return "thanks"
  }

  // Courses
  if (
    lowerMessage.includes("cours") ||
    lowerMessage.includes("matière") ||
    lowerMessage.includes("class") ||
    lowerMessage.includes("leçon") ||
    lowerMessage.includes("programme")
  ) {
    return "courses"
  }

  // Assignments
  if (
    lowerMessage.includes("devoir") ||
    lowerMessage.includes("assignment") ||
    lowerMessage.includes("homework") ||
    lowerMessage.includes("exercice") ||
    lowerMessage.includes("projet") ||
    lowerMessage.includes("travail")
  ) {
    return "assignments"
  }

  // Grades
  if (
    lowerMessage.includes("note") ||
    lowerMessage.includes("grade") ||
    lowerMessage.includes("résultat") ||
    lowerMessage.includes("score") ||
    lowerMessage.includes("évaluation")
  ) {
    return "grades"
  }

  // Technical support
  if (
    lowerMessage.includes("problème") ||
    lowerMessage.includes("bug") ||
    lowerMessage.includes("erreur") ||
    lowerMessage.includes("technique") ||
    lowerMessage.includes("marche pas") ||
    lowerMessage.includes("fonctionne pas")
  ) {
    return "technical"
  }

  // Study tips
  if (
    lowerMessage.includes("étudier") ||
    lowerMessage.includes("apprendre") ||
    lowerMessage.includes("réviser") ||
    lowerMessage.includes("conseil") ||
    lowerMessage.includes("méthode")
  ) {
    return "study"
  }

  // Schedule
  if (
    lowerMessage.includes("horaire") ||
    lowerMessage.includes("planning") ||
    lowerMessage.includes("emploi du temps") ||
    lowerMessage.includes("calendrier") ||
    lowerMessage.includes("quand")
  ) {
    return "schedule"
  }

  // Help
  if (
    lowerMessage.includes("aide") ||
    lowerMessage.includes("help") ||
    lowerMessage.includes("comment") ||
    lowerMessage.includes("où") ||
    lowerMessage.includes("que faire")
  ) {
    return "help"
  }

  return "default"
}

function getRandomResponse(category: keyof typeof frenchResponses): string {
  const responses = frenchResponses[category]
  return responses[Math.floor(Math.random() * responses.length)]
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json([
        {
          recipient_id: "user",
          text: "Vous devez être connecté pour utiliser le chatbot.",
        },
      ])
    }

    const { message, senderId } = await req.json()

    if (!message || !senderId) {
      return NextResponse.json([
        {
          recipient_id: senderId || "user",
          text: "Je n'ai pas reçu votre message correctement. Pouvez-vous réessayer ?",
        },
      ])
    }

    // Get the Rasa server URL from environment variables
    const rasaUrl = process.env.RASA_SERVER_URL || "http://localhost:5005"
    const useRasa = process.env.USE_RASA !== "false" // Allow disabling Rasa via env var

    // Try Rasa first if enabled, but with a very short timeout
    if (useRasa) {
      try {
        console.log(`Tentative rapide de connexion à Rasa: ${rasaUrl}`)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // Very short timeout

        const response = await fetch(`${rasaUrl}/webhooks/rest/webhook`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: senderId,
            message,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            console.log("Réponse Rasa reçue avec succès")
            return NextResponse.json(data)
          }
        }
      } catch (error) {
        console.log("Rasa non disponible, utilisation du mode de secours:", error)
      }
    }

    // Fallback to database queries based on message content
    const lowerMessage = message.toLowerCase()

    // Check for course-related queries
    if (lowerMessage.includes("cours") || lowerMessage.includes("matière")) {
      if (lowerMessage.includes("inscrit") || lowerMessage.includes("acheté")) {
        // Get purchased courses
        const purchasedCourses = await db.purchase.findMany({
          where: { userId },
          include: {
            course: {
              include: {
                category: true
              }
            }
          }
        })

        if (purchasedCourses.length > 0) {
          const courseList = purchasedCourses
            .map(p => `- ${p.course.title} (${p.course.category?.name || 'Non catégorisé'})`)
            .join('\n')
          
          return NextResponse.json([{
            recipient_id: senderId,
            text: `Voici les cours auxquels vous êtes inscrit :\n\n${courseList}`
          }])
        }
      } else if (lowerMessage.includes("créé")) {
        // Get created courses
        const createdCourses = await db.course.findMany({
          where: { userId },
          include: {
            category: true
          }
        })

        if (createdCourses.length > 0) {
          const courseList = createdCourses
            .map(c => `- ${c.title} (${c.category?.name || 'Non catégorisé'})`)
            .join('\n')
          
          return NextResponse.json([{
            recipient_id: senderId,
            text: `Voici les cours que vous avez créés :\n\n${courseList}`
          }])
        }
      }
    }

    // Check for progress-related queries
    if (lowerMessage.includes("progression") || lowerMessage.includes("avancement")) {
      const userProgress = await db.userProgress.findMany({
        where: { userId },
        include: {
          chapter: {
            include: {
              course: true
            }
          }
        }
      })

      if (userProgress.length > 0) {
        const progressByCourse = userProgress.reduce((acc, progress) => {
          const courseName = progress.chapter.course.title
          if (!acc[courseName]) {
            acc[courseName] = { completed: 0, total: 0 }
          }
          acc[courseName].total++
          if (progress.isCompleted) {
            acc[courseName].completed++
          }
          return acc
        }, {} as Record<string, { completed: number; total: number }>)

        const progressList = Object.entries(progressByCourse)
          .map(([course, { completed, total }]) => {
            const percentage = Math.round((completed / total) * 100)
            return `- ${course}: ${percentage}% (${completed}/${total} chapitres)`
          })
          .join('\n')

        return NextResponse.json([{
          recipient_id: senderId,
          text: `Voici votre progression :\n\n${progressList}`
        }])
      }
    }

    // Fallback response - always works
    console.log("Génération d'une réponse de secours")
    const category = categorizeMessage(message)
    const responseText = getRandomResponse(category)

    return NextResponse.json([
      {
        recipient_id: senderId,
        text: responseText,
      },
    ])
  } catch (error: any) {
    console.error("Erreur dans l'API chatbot:", error)
    return NextResponse.json([
      {
        recipient_id: "user",
        text: "Je suis désolé, je rencontre des difficultés. Pouvez-vous reformuler votre question ?",
      },
    ])
  }
}
