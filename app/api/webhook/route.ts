import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const headersList = await headers();
        const signature = headersList.get("Stripe-Signature");

        if (!signature) {
            console.error("No Stripe signature found in headers");
            return new NextResponse("No signature", { status: 400 });
        }

        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.error("Missing STRIPE_WEBHOOK_SECRET");
            return new NextResponse("Webhook secret is not configured", { status: 500 });
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
            console.log("Webhook event constructed successfully:", event.type);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error("Webhook signature verification failed:", errorMessage);
            return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
        }

        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session?.metadata?.userId;
        const courseId = session?.metadata?.courseId;

        if (event.type === "checkout.session.completed") {
            if (!userId || !courseId) {
                console.error("Missing metadata in session:", { userId, courseId });
                return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 });
            }

            try {
                await db.purchase.create({
                    data: {
                        courseId: courseId,
                        userId: userId
                    }
                });
                console.log("Purchase created successfully");
            } catch (error) {
                console.error("Failed to create purchase:", error);
                return new NextResponse("Failed to create purchase", { status: 500 });
            }
        } else {
            console.log(`Unhandled event type: ${event.type}`);
            return new NextResponse(`Unhandled event type ${event.type}`, { status: 200 });
        }

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("Unexpected error in webhook handler:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}