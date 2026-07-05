interface TerminalWindowProps {
  children: React.ReactNode;
  path?: string;
  className?: string;
}

export default function TerminalWindow({
  children,
  path = "student@timetable-sync:~",
  className = "",
}: TerminalWindowProps) {
  return (
    <div className={`terminal-window ${className}`}>
      <div className="terminal-chrome">
        <div className="terminal-dot" />
        <div className="terminal-dot" />
        <div className="terminal-dot" />
        <span className="terminal-path">{path}</span>
      </div>
      <div style={{ padding: "40px" }}>{children}</div>
    </div>
  );
}