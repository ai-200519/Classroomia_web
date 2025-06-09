import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const user = await currentUser()
        console.log("🚀 ~ file: route.ts:7 ~ POST ~ user:", user)

        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) return new NextResponse("Unauthorized", { status: 401 })

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true
            }
        });

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: params.courseId
                }
            }
        })

        if (purchase) return new NextResponse("Cursus déjà acheté", { status: 400 })

        if (!course) return new NextResponse("Cursus non trouvé", { status: 404 })

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: 'USD',
                    product_data: {
                        name: course.title,
                        description: course.description!
                    },
                    unit_amount: Math.round(course.price! * 100)
                }
            }
        ];

        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: user.id
            },
            select: {
                stripeCustomerId: true
            }
        })

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress
            })

            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id
                }
            })
        }

        // Get the origin from the request headers
        const origin = req.headers.get('origin') || 'http://localhost:3000'
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode: 'payment',
            success_url: `${baseUrl}/courses/${course.id}?success=1`,
            cancel_url: `${baseUrl}/courses/${course.id}?canceled=1`,
            metadata: {
                courseId: course.id,
                userId: user.id
            }
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('[COURSE_ID_CHECKOUT]', error)
        if (error instanceof Error) {
            return new NextResponse(error.message, { status: 500 })
        }
        return new NextResponse("Une erreur est survenue lors du paiement", { status: 500 })
    }
}