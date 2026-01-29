import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, Registration } from "@/lib/supabase";
import { Resend } from "resend";
import { generateAdminEmailHtml, generateRegistrantEmailHtml } from "@/lib/emails";

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "ymgmovementaustralia@gmail.com";

// Discount code configuration (must match frontend)
interface DiscountCode {
  code: string;
  price: number;
  validUntil?: Date;
  description: string;
}

const DISCOUNT_CODES: DiscountCode[] = [
  {
    code: "SSE26",
    price: 230,
    validUntil: new Date("2026-01-31T23:59:59"),
    description: "SSE26 discount",
  },
  {
    code: "devtest123",
    price: 1,
    description: "Dev testing",
  },
  {
    code: "PADRE",
    price: 200,
    description: "For Priests",
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "full_name",
      "date_of_birth",
      "mobile_number",
      "email",
      "city_suburb",
      "state",
      "country",
      "dietary_requirements",
      "medical_conditions",
      "emergency_contact_name",
      "emergency_contact_relationship",
      "emergency_contact_phone",
      "confirms_18_or_older",
      "agrees_to_code_of_conduct",
      "photo_consent",
      "registration_type",
      "amount_paid",
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate consent checkboxes
    if (!body.confirms_18_or_older || !body.agrees_to_code_of_conduct) {
      return NextResponse.json(
        { error: "You must confirm age and agree to code of conduct" },
        { status: 400 }
      );
    }

    // Check if email already registered
    const { data: existingRegistration } = await supabaseAdmin
      .from("registrations")
      .select("id")
      .eq("email", body.email)
      .single();

    if (existingRegistration) {
      return NextResponse.json(
        { error: "This email is already registered for the event" },
        { status: 400 }
      );
    }

    // Determine price based on date and discount code
    const now = new Date();
    const earlyBirdDeadline = new Date("2026-04-30T23:59:59");
    const basePrice = now <= earlyBirdDeadline ? 250 : 300;
    
    let expectedPrice = basePrice;
    let appliedDiscountCode: DiscountCode | null = null;

    // Check for discount code
    if (body.discount_code) {
      const foundCode = DISCOUNT_CODES.find(
        (dc) => dc.code.toLowerCase() === body.discount_code.toLowerCase()
      );

      if (!foundCode) {
        return NextResponse.json(
          { error: "Invalid discount code" },
          { status: 400 }
        );
      }

      // Check if code has expired
      if (foundCode.validUntil && now > foundCode.validUntil) {
        return NextResponse.json(
          { error: "This discount code has expired" },
          { status: 400 }
        );
      }

      expectedPrice = foundCode.price;
      appliedDiscountCode = foundCode;
    }

    // Allow small floating point differences for decimal prices
    if (Math.abs(body.amount_paid - expectedPrice) > 0.01) {
      return NextResponse.json(
        { error: "Invalid registration price" },
        { status: 400 }
      );
    }

    // Prepare registration data
    const registrationData: Omit<Registration, "id" | "created_at"> = {
      full_name: body.full_name,
      date_of_birth: body.date_of_birth,
      mobile_number: body.mobile_number,
      email: body.email,
      city_suburb: body.city_suburb,
      state: body.state,
      country: body.country,
      dietary_requirements: body.dietary_requirements,
      dietary_other: body.dietary_other || null,
      medical_conditions: body.medical_conditions,
      medical_details: body.medical_details || null,
      emergency_contact_name: body.emergency_contact_name,
      emergency_contact_relationship: body.emergency_contact_relationship,
      emergency_contact_phone: body.emergency_contact_phone,
      vocation_status: body.vocation_status || null,
      is_catholic: body.is_catholic || null,
      parish: body.parish || null,
      first_ymg_event: body.first_ymg_event || null,
      how_heard: body.how_heard || null,
      how_heard_other: body.how_heard_other || null,
      confirms_18_or_older: body.confirms_18_or_older,
      agrees_to_code_of_conduct: body.agrees_to_code_of_conduct,
      photo_consent: body.photo_consent === "yes",
      marketing_consent: body.marketing_consent || false,
      registration_type: body.registration_type,
      amount_paid: expectedPrice,
      paid: false,
      discount_code: appliedDiscountCode?.code || undefined,
    };

    // Insert registration into Supabase
    const { data: registration, error: insertError } = await supabaseAdmin
      .from("registrations")
      .insert(registrationData)
      .select()
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create registration" },
        { status: 500 }
      );
    }

    // Send admin notification email (paid: false - registration pending payment)
    try {
      await resend.emails.send({
        from: "YMG Registration <noreply@mail.ymgmovement.org.au>",
        to: NOTIFICATION_EMAIL,
        subject: `New Power Retreat Registration: ${registration.full_name}`,
        html: generateAdminEmailHtml(registration as Record<string, unknown>, false),
      });
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
      // Don't fail the registration if email fails
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
      // Don't fail the registration if email fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
