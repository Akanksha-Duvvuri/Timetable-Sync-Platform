"use client";

import TerminalWindow from "@/components/ui/TerminalWindow";

interface ModalShellProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function ModalShell({ children, onClose }: ModalShellProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 10, 18, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "24px",
      }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="modal-container">
        <TerminalWindow className="glow-border" path="student@timetable-sync:~/connect">
          {children}
        </TerminalWindow>
      </div>
    </div>
  );
}
