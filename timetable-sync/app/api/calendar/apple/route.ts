import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const DAY_NAMES = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

function nextDateForWeekday(dayOfWeek: number): string {
  const today = new Date();
  const todayDow = (today.getDay() + 6) % 7;
  let diff = dayOfWeek - todayDow;
  if (diff < 0) diff += 7;
  const target = new Date(today);
  target.setDate(today.getDate() + diff);
  return target.toISOString().split("T")[0].replace(/-/g, "");
}

function icsEscape(text: string): string {
  return text.replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export async function GET(req: NextRequest) {
  const className = req.nextUrl.searchParams.get("class_name");
  const section = req.nextUrl.searchParams.get("section");
  const download = req.nextUrl.searchParams.get("download");

  if (!className || !section) {
    return NextResponse.json(
      { error: "class_name and section are required" },
      { status: 400 }
    );
  }

  const { data: classRow } = await supabase
    .from("classes")
    .select("id")
    .eq("name", className)
    .eq("section", section)
    .maybeSingle();

  if (!classRow) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  const { data: slots } = await supabase
    .from("timetable_slots")
    .select("id, subject, teacher, day_of_week, start_time, end_time")
    .eq("class_id", classRow.id);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Timetable Sync//EN",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${icsEscape(`${className} ${section} Timetable`)}`,
  ];

  for (const slot of slots ?? []) {
    const date = nextDateForWeekday(slot.day_of_week);
    const start = `${date}T${slot.start_time.replace(/:/g, "")}00`;
    const end = `${date}T${slot.end_time.replace(/:/g, "")}00`;

    lines.push(
      "BEGIN:VEVENT",
      `UID:${slot.id}@timetable-sync`,
      `SUMMARY:${icsEscape(slot.subject)}`,
      slot.teacher ? `DESCRIPTION:${icsEscape("Instructor: " + slot.teacher)}` : "",
      `DTSTART;TZID=Asia/Kolkata:${start}`,
      `DTEND;TZID=Asia/Kolkata:${end}`,
      `RRULE:FREQ=WEEKLY;BYDAY=${DAY_NAMES[slot.day_of_week]}`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");

  const body = lines.filter(Boolean).join("\r\n");

  const headers: Record<string, string> = {
    "Content-Type": "text/calendar; charset=utf-8",
  };
  if (download) {
    headers["Content-Disposition"] = `attachment; filename="timetable.ics"`;
  }

  return new NextResponse(body, { headers });
}
