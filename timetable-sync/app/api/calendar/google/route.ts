import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { supabase } from "@/lib/supabase";
import { pushSlotsToGoogleCalendar } from "@/lib/google-calendar";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.accessToken;
  const sessionError = (session as any)?.error;

  if (sessionError === "RefreshAccessTokenError" || !accessToken) {
    return NextResponse.json(
      { error: "Your Google session expired — please sign in again" },
      { status: 401 }
    );
  }

  const { className, section } = await req.json();

  if (!className || !section) {
    return NextResponse.json(
      { error: "className and section are required" },
      { status: 400 }
    );
  }

  const { data: classRow, error: classError } = await supabase
    .from("classes")
    .select("id")
    .eq("name", className)
    .eq("section", section)
    .maybeSingle();

  if (classError || !classRow) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  const { data: slots, error: slotsError } = await supabase
    .from("timetable_slots")
    .select("id, subject, teacher, day_of_week, start_time, end_time")
    .eq("class_id", classRow.id);

  if (slotsError || !slots || slots.length === 0) {
    return NextResponse.json({ error: "No timetable slots found" }, { status: 404 });
  }

  const result = await pushSlotsToGoogleCalendar(accessToken, slots);

  return NextResponse.json(result);
}
