import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const MIN_AMOUNT_AUD = 1;
const MAX_AMOUNT_AUD = 50_000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const amountDollars = typeof body.amount === "number" ? body.amount : Number(body.amount);

    if (!Number.isFinite(amountDollars) || amountDollars < MIN_AMOUNT_AUD || amountDollars > MAX_AMOUNT_AUD) {
      return NextResponse.json(
        { error: `Amount must be between $${MIN_AMOUNT_AUD} and $${MAX_AMOUNT_AUD} AUD` },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(amountDollars * 100);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: "Donation to Young Men of God",
              description: "Your generosity helps us disciple young men, grow in brotherhood, and spread the gospel.",
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/donate/cancelled`,
      metadata: { type: "donation" },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Donate checkout error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
