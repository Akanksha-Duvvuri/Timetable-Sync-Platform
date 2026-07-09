"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import DecryptText from "@/components/ui/DecryptText";
import TerminalWindow from "@/components/ui/TerminalWindow";
import ModalShell from "@/components/Modal/ModalShell";
import StepInput from "@/components/Modal/StepInput";
import StepPreview from "@/components/Modal/StepPreview";
import { parseRollNumber } from "@/lib/roll-parser";
import { ModalStep, Provider } from "@/types";

const PENDING_KEY = "timetable-sync-pending";

export default function Home() {
  const { data: session, status } = useSession();

  const [subReady, setSubReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<ModalStep>("input");
  const [rollNumber, setRollNumber] = useState("");
  const [section, setSection] = useState("");
  const [syncResult, setSyncResult] = useState<{ created: number; failed: number } | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const closeModal = () => {
    setModalOpen(false);
    setStep("input");
    setRollNumber("");
    setSection("");
    setSyncResult(null);
    setSyncError(null);
    setAppleLinks(null);
  };

  const pushToGoogle = async (roll: string, sec: string) => {
    const parsed = parseRollNumber(roll);
    if (!parsed.valid || !parsed.branch) {
      setSyncError("Could not parse roll number");
      return;
    }

    setStep("connecting");

    try {
      const res = await fetch("/api/calendar/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ className: parsed.branch.name, section: sec }),
      });
      const data = await res.json();

      if (data.error) {
        setSyncError(data.error);
      } else {
        setSyncResult(data);
      }
    } catch {
      setSyncError("Failed to sync with Google Calendar");
    }

    setStep("success");
  };

  // after a Google sign-in redirect, resume the pending sync automatically
  useEffect(() => {
    if (status !== "authenticated") return;

    const pending = sessionStorage.getItem(PENDING_KEY);
    if (!pending) return;

    sessionStorage.removeItem(PENDING_KEY);
    const { rollNumber: pRoll, section: pSection } = JSON.parse(pending);

    setRollNumber(pRoll);
    setSection(pSection);
    setModalOpen(true);
    pushToGoogle(pRoll, pSection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const [appleLinks, setAppleLinks] = useState<{ subscribe: string; download: string } | null>(null);

  const handleSync = async (provider: Provider) => {
    if (provider === "apple") {
      const parsed = parseRollNumber(rollNumber);
      if (!parsed.valid || !parsed.branch) {
        setSyncError("Could not parse roll number");
        setStep("success");
        return;
      }
      const params = new URLSearchParams({
        class_name: parsed.branch.name,
        section,
      });
      const host = window.location.host;
      setAppleLinks({
        subscribe: `webcal://${host}/api/calendar/apple?${params.toString()}`,
        download: `/api/calendar/apple?${params.toString()}&download=1`,
      });
      setStep("success");
      return;
    }

    if (status !== "authenticated") {
      sessionStorage.setItem(PENDING_KEY, JSON.stringify({ rollNumber, section }));
      signIn("google");
      return;
    }

    await pushToGoogle(rollNumber, section);
  };

  return (
    <>
      <div className="void-bg" />
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <TerminalWindow className="glow-border">
          <div style={{ maxWidth: "480px" }}>
            <p className="text-muted" style={{ fontSize: "13px", marginBottom: "12px" }}>
              {"> "}TIMETABLE_SYNC.exe
            </p>

            <h1 style={{ fontSize: "clamp(22px, 6vw, 28px)", fontWeight: 600, margin: "0 0 16px" }}>
              <DecryptText
                text="your schedule, decrypted"
                speed={25}
                onComplete={() => setSubReady(true)}
              />
            </h1>

            {subReady && (
              <p className="text-muted" style={{ fontSize: "14px", lineHeight: 1.6, margin: "0 0 32px" }}>
                <DecryptText
                  text="enter your roll number and class — we sync it straight to the calendar you already use."
                  speed={12}
                />
              </p>
            )}

            <button className="prompt-btn" onClick={() => setModalOpen(true)}>
              {"> "}connect_
            </button>
          </div>
        </TerminalWindow>
      </main>

      {modalOpen && (
        <ModalShell onClose={closeModal}>
          {step === "input" && (
            <StepInput
              onContinue={(roll, sec) => {
                setRollNumber(roll);
                setSection(sec);
                setStep("preview");
              }}
            />
          )}

          {step === "preview" && (
            <StepPreview
              rollNumber={rollNumber}
              section={section}
              onBack={() => setStep("input")}
              onSync={handleSync}
            />
          )}

          {step === "connecting" && (
            <p className="text-muted" style={{ fontSize: "13px" }}>
              {"> "}connecting to your calendar...
            </p>
          )}

          {step === "success" && (
            <div>
              {syncError && (
                <p style={{ color: "#E24B4A", fontSize: "13px", marginBottom: "16px" }}>
                  {"> "}{syncError}
                </p>
              )}
              {syncResult && (
                <p className="text-success" style={{ fontSize: "14px", marginBottom: "16px" }}>
                  {"> "}synced {syncResult.created} classes to your calendar
                  {syncResult.failed > 0 ? ` (${syncResult.failed} failed)` : ""}
                </p>
              )}
              {appleLinks && (
                <div style={{ marginBottom: "16px" }}>
                  <p className="text-success" style={{ fontSize: "14px", marginBottom: "12px" }}>
                    {"> "}your feed is ready
                  </p>
                  <a
                    href={appleLinks.subscribe}
                    className="prompt-btn"
                    style={{ display: "block", textAlign: "center", marginBottom: "8px", textDecoration: "none" }}
                  >
                    {"> "}subscribe on apple calendar_
                  </a>
                  <a
                    href={appleLinks.download}
                    className="prompt-btn"
                    style={{ display: "block", textAlign: "center", textDecoration: "none", opacity: 0.7 }}
                  >
                    {"> "}or download .ics_
                  </a>
                </div>
              )}
              <button className="prompt-btn" onClick={closeModal}>
                {"> "}done_
              </button>
            </div>
          )}
        </ModalShell>
      )}
    </>
  );
}
