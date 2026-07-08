"use client";

import { useState, useMemo } from "react";
import DecryptText from "@/components/ui/DecryptText";
import { parseRollNumber, sectionOptions, ParsedRoll } from "@/lib/roll-parser";

interface StepInputProps {
  onContinue: (rollNumber: string, section: string) => void;
}

export default function StepInput({ onContinue }: StepInputProps) {
  const [rollNumber, setRollNumber] = useState("");
  const [section, setSection] = useState("");

  const parsed: ParsedRoll = useMemo(() => {
    if (rollNumber.length < 11) return { valid: false };
    return parseRollNumber(rollNumber);
  }, [rollNumber]);

  const showError = rollNumber.length === 11 && !parsed.valid;
  const sections = parsed.valid && parsed.branch ? sectionOptions(parsed.branch) : [];

  // auto-select the only section when a branch has just one
  if (parsed.valid && sections.length === 1 && section !== sections[0]) {
    setSection(sections[0]);
  }

  const canContinue = parsed.valid && section.length > 0;

  return (
    <div>
      <p className="text-muted" style={{ fontSize: "13px", marginBottom: "12px" }}>
        {"> "}enter roll number
      </p>

      <input
        value={rollNumber}
        onChange={(e) => {
          const v = e.target.value.toUpperCase().slice(0, 11);
          setRollNumber(v);
          setSection("");
        }}
        placeholder="SE24UCSE070"
        maxLength={11}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(108, 122, 240, 0.35)",
          borderRadius: "8px",
          padding: "12px 14px",
          color: "var(--text-primary)",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "16px",
          letterSpacing: "0.05em",
          outline: "none",
          marginBottom: "8px",
        }}
      />

      <div style={{ minHeight: "20px", marginBottom: "20px" }}>
        {showError && (
          <p style={{ color: "#E24B4A", fontSize: "13px", margin: 0 }}>
            {parsed.error}
          </p>
        )}
        {parsed.valid && parsed.branch && (
          <p className="text-accent" style={{ fontSize: "13px", margin: 0 }}>
            <DecryptText
              text={`detected: ${parsed.branch.name} · batch 20${parsed.year}`}
              speed={15}
            />
          </p>
        )}
      </div>

      {parsed.valid && parsed.branch && sections.length > 1 && (
        <>
          <p className="text-muted" style={{ fontSize: "13px", marginBottom: "12px" }}>
            {"> "}select section
          </p>
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className="prompt-btn"
                style={{
                  flex: 1,
                  background:
                    section === s ? "rgba(108, 122, 240, 0.28)" : undefined,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      {parsed.valid && sections.length === 1 && (
        <p className="text-muted" style={{ fontSize: "13px", marginBottom: "24px" }}>
          {"> "}section {sections[0]} (only section)
        </p>
      )}

      <button
        className="prompt-btn"
        style={{
          width: "100%",
          opacity: canContinue ? 1 : 0.4,
          cursor: canContinue ? "pointer" : "not-allowed",
        }}
        disabled={!canContinue}
        onClick={() => canContinue && onContinue(rollNumber, section)}
      >
        {"> "}continue_
      </button>
    </div>
  );
}
