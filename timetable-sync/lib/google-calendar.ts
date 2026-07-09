import { google } from "googleapis";
import { TimetableSlot } from "@/types";

const DAY_NAMES = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

// finds the next real calendar date (yyyy-mm-dd) for a given day_of_week
// (0 = Monday ... 4 = Friday), so the first event lands on a real upcoming day
function nextDateForWeekday(dayOfWeek: number): string {
  const today = new Date();
  const todayDow = (today.getDay() + 6) % 7; // convert JS Sun=0 to Mon=0
  let diff = dayOfWeek - todayDow;
  if (diff < 0) diff += 7;
  const target = new Date(today);
  target.setDate(today.getDate() + diff);
  return target.toISOString().split("T")[0];
}

function toHMS(t: string): string {
  return t.length === 5 ? `${t}:00` : t;
}

export async function pushSlotsToGoogleCalendar(
  accessToken: string,
  slots: TimetableSlot[]
): Promise<{ created: number; failed: number }> {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });

  let created = 0;
  let failed = 0;

  for (const slot of slots) {
    const date = nextDateForWeekday(slot.day_of_week);
    const startDateTime = `${date}T${toHMS(slot.start_time)}`;
    const endDateTime = `${date}T${toHMS(slot.end_time)}`;

    try {
      await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: slot.subject,
          description: slot.teacher ? `Instructor: ${slot.teacher}` : undefined,
          start: { dateTime: startDateTime, timeZone: "Asia/Kolkata" },
          end: { dateTime: endDateTime, timeZone: "Asia/Kolkata" },
          recurrence: [`RRULE:FREQ=WEEKLY;BYDAY=${DAY_NAMES[slot.day_of_week]}`],
        },
      });
      created += 1;
    } catch (err: any) {
      console.error(
        "Google Calendar insert failed:",
        JSON.stringify(err?.response?.data ?? err?.message ?? err, null, 2)
      );
      failed += 1;
    }
  }

  return { created, failed };
}
