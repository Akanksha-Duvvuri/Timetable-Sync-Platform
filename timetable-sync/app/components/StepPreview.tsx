"use client";

import { useState, useEffect } from "react";
import DecryptText from "../components/ui/DecryptText";
import TimetableGrid from "../components/TimetableGrid";
import ProviderPicker from "../components/ProviderPicker";
import { detectProvider } from "../lib/device-detect";
import { parseRollNumber } from "../lib/roll-parser";
import { Provider, TimetableSlot } from "../types/index";

interface StepPreviewProps {
  rollNumber: string;
  section: string; // e.g. "CS1"
  onSync: (provider: Provider) => void;
  onBack: () => void;
}

export default function StepPreview({
  rollNumber,
  section,
  onSync,
  onBack,
}: StepPreviewProps) {
  const [provider, setProvider] = useState<Provider>("google");
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProvider(detectProvider());
  }, []);

  useEffect(() => {
    const parsed = parseRollNumber(rollNumber);
    if (!parsed.valid || !parsed.branch) {
      setError("Could not determine branch from roll number");
      setLoading(false);
      return;
    }

    const params = new URLSearchParams({
      roll_number: rollNumber,
      class_name: parsed.branch.name,
      section,
    });

    fetch(`/api/timetable?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setSlots(data.slots ?? []);
        }
      })
      .catch(() => setError("Failed to reach the server"))
      .finally(() => setLoading(false));
  }, [rollNumber, section]);

  return (
    <div>
      <p className="text-muted" style={{ fontSize: "13px", marginBottom: "4px" }}>
        {"> "}
        <DecryptText text={`${rollNumber} · section ${section}`} speed={12} />
      </p>

      <h2 style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 20px" }}>
        your timetable
      </h2>

      {loading && (
        <p className="text-muted" style={{ fontSize: "13px" }}>
          {"> "}fetching timetable...
        </p>
      )}

      {!loading && error && (
        <p style={{ color: "#E24B4A", fontSize: "13px" }}>
          {"> "}error: {error}
        </p>
      )}

      {!loading && !error && slots.length === 0 && (
        <p className="text-muted" style={{ fontSize: "13px" }}>
          {"> "}no timetable found for this class/section yet
        </p>
      )}

      {!loading && !error && slots.length > 0 && (
        <>
          <TimetableGrid slots={slots} />

          <p
            className="text-muted"
            style={{ fontSize: "13px", margin: "24px 0 12px" }}
          >
            {"> "}sync to
          </p>

          <ProviderPicker selected={provider} onChange={setProvider} />

          <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
            <button
              className="prompt-btn"
              style={{ flex: "0 0 auto", opacity: 0.6 }}
              onClick={onBack}
            >
              {"< "}back
            </button>
            <button
              className="prompt-btn"
              style={{ flex: 1 }}
              onClick={() => onSync(provider)}
            >
              {"> "}sync now_
            </button>
          </div>
        </>
      )}

      {!loading && (error || slots.length === 0) && (
        <button
          className="prompt-btn"
          style={{ marginTop: "16px", opacity: 0.6 }}
          onClick={onBack}
        >
          {"< "}back
        </button>
      )}
    </div>
  );
}