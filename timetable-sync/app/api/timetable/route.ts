import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const rollNumber = req.nextUrl.searchParams.get("roll_number");
  const className = req.nextUrl.searchParams.get("class_name"); // e.g. "CSE"
  const section = req.nextUrl.searchParams.get("section"); // e.g. "CS1"

  if (!className || !section) {
    return NextResponse.json(
      { error: "class_name and section are required" },
      { status: 400 }
    );
  }

  // find the class row matching name + section
  const { data: classRow, error: classError } = await supabase
    .from("classes")
    .select("id")
    .eq("name", className)
    .eq("section", section)
    .maybeSingle();

  if (classError) {
    return NextResponse.json({ error: classError.message }, { status: 500 });
  }

  if (!classRow) {
    return NextResponse.json(
      { error: "No matching class/section found" },
      { status: 404 }
    );
  }

  const { data: slots, error: slotsError } = await supabase
    .from("timetable_slots")
    .select("id, subject, teacher, day_of_week, start_time, end_time")
    .eq("class_id", classRow.id)
    .order("day_of_week")
    .order("start_time");

  if (slotsError) {
    return NextResponse.json({ error: slotsError.message }, { status: 500 });
  }

  return NextResponse.json({ roll_number: rollNumber, slots: slots ?? [] });
}
