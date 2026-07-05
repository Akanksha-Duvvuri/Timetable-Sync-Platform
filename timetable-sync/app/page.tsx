"use client";

import { useState } from "react";
import DecryptText from "../app/components/ui/DecryptText";
import TerminalWindow from "../app/components/ui/TerminalWindow";
import ModalShell from "../app/components/ModalShell";
import StepInput from "../app/components/StepInput";

export default function Home() {
  const [subReady, setSubReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
        <TerminalWindow className="glow-border" >
          <div style={{ maxWidth: "480px" }}>
            <p className="text-muted" style={{ fontSize: "13px", marginBottom: "12px" }}>
              {"> "}TIMETABLE_SYNC.exe
            </p>

            <h1 style={{ fontSize: "28px", fontWeight: 600, margin: "0 0 16px" }}>
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
        <ModalShell onClose={() => setModalOpen(false)}>
          <StepInput
            onContinue={(rollNumber, section) => {
              console.log("roll:", rollNumber, "section:", section);
              // next: pass this into the timetable lookup / preview step
            }}
          />
        </ModalShell>
      )}
    </>
  );
}