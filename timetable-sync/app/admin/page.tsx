"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

interface ClassRow {
  id: string;
  name: string;
  section: string;
}

interface SlotRow {
  id: string;
  subject: string;
  teacher: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");

  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [slots, setSlots] = useState<SlotRow[]>([]);

  // new class form
  const [newClassName, setNewClassName] = useState("");
  const [newClassSection, setNewClassSection] = useState("");

  // new slot form
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const loadClasses = useCallback(async () => {
    const { data } = await supabase.from("classes").select("*").order("name");
    if (data) setClasses(data as ClassRow[]);
  }, []);

  const loadSlots = useCallback(async (classId: string) => {
    const { data } = await supabase
      .from("timetable_slots")
      .select("*")
      .eq("class_id", classId)
      .order("day_of_week")
      .order("start_time");
    if (data) setSlots(data as SlotRow[]);
  }, []);

  useEffect(() => {
    if (authed) loadClasses();
  }, [authed, loadClasses]);

  useEffect(() => {
    if (selectedClassId) loadSlots(selectedClassId);
  }, [selectedClassId, loadSlots]);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      alert("Wrong password");
    }
  };

  const addClass = async () => {
    if (!newClassName || !newClassSection) return;
    const { error } = await supabase
      .from("classes")
      .insert({ name: newClassName, section: newClassSection });
    if (error) {
      alert(error.message);
      return;
    }
    setNewClassName("");
    setNewClassSection("");
    loadClasses();
  };

  const addSlot = async () => {
    if (!selectedClassId || !subject || !startTime || !endTime) return;
    const { error } = await supabase.from("timetable_slots").insert({
      class_id: selectedClassId,
      subject,
      teacher: teacher || null,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
    });
    if (error) {
      alert(error.message);
      return;
    }
    setSubject("");
    setTeacher("");
    setStartTime("");
    setEndTime("");
    loadSlots(selectedClassId);
  };

  const deleteSlot = async (id: string) => {
    await supabase.from("timetable_slots").delete().eq("id", id);
    loadSlots(selectedClassId);
  };

  if (!authed) {
    return (
      <>
        <div className="void-bg" />
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="terminal-window glow-border" style={{ padding: "40px", width: "320px" }}>
            <p className="text-muted" style={{ fontSize: "13px", marginBottom: "12px" }}>
              {"> "}admin access
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="password"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(108, 122, 240, 0.35)",
                borderRadius: "8px",
                padding: "10px 12px",
                color: "var(--text-primary)",
                fontFamily: "JetBrains Mono, monospace",
                marginBottom: "16px",
              }}
            />
            <button className="prompt-btn" style={{ width: "100%" }} onClick={handleLogin}>
              {"> "}login_
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <div className="void-bg" />
      <main style={{ minHeight: "100vh", padding: "40px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "24px" }}>
            {"> "}admin panel
          </h1>

          {/* Add class */}
          <div className="terminal-window" style={{ padding: "24px", marginBottom: "24px" }}>
            <p className="text-muted" style={{ fontSize: "13px", marginBottom: "12px" }}>
              {"> "}add class
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="e.g. CSE"
                style={inputStyle}
              />
              <input
                value={newClassSection}
                onChange={(e) => setNewClassSection(e.target.value)}
                placeholder="e.g. CS1"
                style={inputStyle}
              />
              <button className="prompt-btn" onClick={addClass}>
                {"> "}add_
              </button>
            </div>
          </div>

          {/* Select class */}
          <div className="terminal-window" style={{ padding: "24px", marginBottom: "24px" }}>
            <p className="text-muted" style={{ fontSize: "13px", marginBottom: "12px" }}>
              {"> "}select class to edit
            </p>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              style={{ ...inputStyle, width: "100%" }}
            >
              <option value="">— choose a class —</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.section}
                </option>
              ))}
            </select>
          </div>

          {/* Add slot */}
          {selectedClassId && (
            <div className="terminal-window" style={{ padding: "24px", marginBottom: "24px" }}>
              <p className="text-muted" style={{ fontSize: "13px", marginBottom: "12px" }}>
                {"> "}add timetable slot
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  style={{ ...inputStyle, flex: "1 1 200px" }}
                />
                <input
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  placeholder="Teacher (optional)"
                  style={{ ...inputStyle, flex: "1 1 160px" }}
                />
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(Number(e.target.value))}
                  style={inputStyle}
                >
                  {DAYS.map((d, i) => (
                    <option key={d} value={i}>
                      {d}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <button className="prompt-btn" onClick={addSlot}>
                {"> "}add slot_
              </button>
            </div>
          )}

          {/* Existing slots */}
          {selectedClassId && (
            <div className="terminal-window" style={{ padding: "24px" }}>
              <p className="text-muted" style={{ fontSize: "13px", marginBottom: "12px" }}>
                {"> "}current slots ({slots.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {slots.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "rgba(108, 122, 240, 0.06)",
                      border: "1px solid rgba(108, 122, 240, 0.2)",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "13px",
                    }}
                  >
                    <span>
                      {DAYS[s.day_of_week]} · {s.start_time}–{s.end_time} · {s.subject}
                      {s.teacher ? ` · ${s.teacher}` : ""}
                    </span>
                    <button
                      onClick={() => deleteSlot(s.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#E24B4A",
                        cursor: "pointer",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "12px",
                      }}
                    >
                      delete
                    </button>
                  </div>
                ))}
                {slots.length === 0 && (
                  <p className="text-muted" style={{ fontSize: "13px" }}>
                    no slots yet
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(108, 122, 240, 0.35)",
  borderRadius: "8px",
  padding: "8px 10px",
  color: "var(--text-primary)",
  fontFamily: "JetBrains Mono, monospace",
  fontSize: "13px",
};