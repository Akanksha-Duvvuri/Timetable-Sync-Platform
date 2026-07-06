"use client";

import { useState, useEffect } from "react";
import DecryptText from "../components/ui/DecryptText";
import TimetableGrid from "../components/TimetableGrid";
import ProviderPicker from "../components/ProviderPicker";
import { detectProvider } from "../lib/device-detect";
import { MOCK_TIMETABLE } from "../lib/mock-timetable";
import { Provider } from "../types/index";

interface StepPreviewProps {
  rollNumber: string;
  section: string;
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

  useEffect(() => {
    setProvider(detectProvider());
  }, []);

  // TODO: once Phase 2 (DB schema) + Phase 4 (lookup API) are done,
  // replace MOCK_TIMETABLE with a fetch to `/api/timetable?roll_number=...&section=...`
  const slots = MOCK_TIMETABLE;

  return (
    <div>
      <p className="text-muted" style={{ fontSize: "13px", marginBottom: "4px" }}>
        {"> "}<DecryptText text={`${rollNumber} · section ${section}`} speed={12} />
      </p>

      <h2 style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 20px" }}>
        your timetable
      </h2>

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
    </div>
  );
}