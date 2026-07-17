import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getPowerTalkLimit, isPowerTalkId } from "@/lib/powerTalks";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const powerTalk = body.powerTalk;

    if (!id) {
      return NextResponse.json({ error: "Registration ID required" }, { status: 400 });
    }

    if (typeof powerTalk !== "string" || !isPowerTalkId(powerTalk)) {
      return NextResponse.json({ error: "Valid talk selection required" }, { status: 400 });
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("registrations")
      .select("id, power_talk")
      .eq("id", id)
      .single();

    if (existingError || !existing) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (existing.power_talk) {
      return NextResponse.json(
        { error: "This person already has a talk assigned" },
        { status: 409 }
      );
    }

    const { count, error: countError } = await supabaseAdmin
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .eq("power_talk", powerTalk);

    if (countError) {
      console.error("Supabase count error:", countError);
      return NextResponse.json(
        { error: "Failed to check talk capacity" },
        { status: 500 }
      );
    }

    if ((count || 0) >= getPowerTalkLimit(powerTalk as Parameters<typeof getPowerTalkLimit>[0])) {
      return NextResponse.json(
        { error: "That talk is already full" },
        { status: 409 }
      );
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("registrations")
      .update({ power_talk: powerTalk, power_talk_assigned_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, full_name, power_talk")
      .single();

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return NextResponse.json(
        { error: "Failed to assign talk" },
        { status: 500 }
      );
    }

    return NextResponse.json({ registration: updated });
  } catch (error) {
    console.error("Error assigning power talk:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Registration ID required" }, { status: 400 });
    }

    const { data: updated, error } = await supabaseAdmin
      .from("registrations")
      .update({ power_talk: null, power_talk_assigned_at: null })
      .eq("id", id)
      .select("id, full_name, power_talk")
      .single();

    if (error) {
      console.error("Supabase undo error:", error);
      return NextResponse.json(
        { error: "Failed to undo talk assignment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ registration: updated });
  } catch (error) {
    console.error("Error undoing power talk:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}