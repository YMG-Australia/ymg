import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import Stripe from "stripe";
import { Resend } from "resend";
import { generateAdminEmailHtml, generateRegistrantEmailHtml } from "@/lib/emails";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "ymgmovementaustralia@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const registrationId = session.metadata?.registration_id;

      if (!registrationId) {
        console.error("No registration_id in session metadata");
        return NextResponse.json(
          { error: "Missing registration_id" },
          { status: 400 }
        );
      }

      // Update registration as paid
      const { data: registration, error: updateError } = await supabaseAdmin
        .from("registrations")
        .update({ paid: true })
        .eq("id", registrationId)
        .select()
        .single();

      if (updateError) {
        console.error("Failed to update registration:", updateError);
        return NextResponse.json(
          { error: "Failed to update registration" },
          { status: 500 }
        );
      }

      // Send notification email to admin
      try {
        await resend.emails.send({
          from: "YMG Registration <noreply@mail.ymgmovement.org.au>",
          to: NOTIFICATION_EMAIL,
          subject: `New Power Retreat Registration: ${registration.full_name}`,
          html: generateAdminEmailHtml(registration as Record<string, unknown>, true),
        });
      } catch (emailError) {
        console.error("Failed to send admin notification email:", emailError);
        // Don't fail the webhook if email fails
      }

      // Send confirmation email to registrant
      try {
        await resend.emails.send({
          from: "Young Men of God <noreply@mail.ymgmovement.org.au>",
          to: registration.email,
          replyTo: "ymgmovementaustralia@gmail.com",
          subject: "Your Power Retreat Registration Confirmation",
          html: generateRegistrantEmailHtml(),
        });
      } catch (emailError) {
        console.error("Failed to send registrant confirmation email:", emailError);
        // Don't fail the webhook if email fails
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
