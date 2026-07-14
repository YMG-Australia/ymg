import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: registrations, error } = await supabaseAdmin
      .from("registrations")
      .select("id, created_at, full_name, power_talk")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch power registrations" },
        { status: 500 }
      );
    }

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error("Error fetching power registrations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}