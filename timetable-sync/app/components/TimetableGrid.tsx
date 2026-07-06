import { TimetableSlot } from "@/types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

interface TimetableGridProps {
  slots: TimetableSlot[];
}

export default function TimetableGrid({ slots }: TimetableGridProps) {
  const byDay = DAYS.map((_, dayIndex) =>
    slots
      .filter((s) => s.day_of_week === dayIndex)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
  );

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        overflowX: "auto",
        paddingBottom: "4px",
      }}
    >
      {DAYS.map((day, i) => (
        <div key={day} style={{ flex: "1 0 100px", minWidth: "100px" }}>
          <p
            className="text-muted"
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: "0 0 8px",
              textAlign: "center",
            }}
          >
            {day}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {byDay[i].length === 0 && (
              <div
                style={{
                  border: "1px dashed rgba(108, 122, 240, 0.2)",
                  borderRadius: "6px",
                  padding: "8px 6px",
                  fontSize: "11px",
                }}
                className="text-muted"
              >
                —
              </div>
            )}
            {byDay[i].map((slot) => (
              <div
                key={slot.id}
                style={{
                  background: "rgba(108, 122, 240, 0.08)",
                  border: "1px solid rgba(108, 122, 240, 0.25)",
                  borderRadius: "6px",
                  padding: "8px 8px",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    margin: "0 0 2px",
                    color: "var(--text-primary)",
                    lineHeight: 1.3,
                  }}
                >
                  {slot.subject}
                </p>
                <p
                  className="text-muted"
                  style={{ fontSize: "10px", margin: 0 }}
                >
                  {slot.start_time}–{slot.end_time}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}