"use client";

import { useEffect, useState, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>/\\|";

interface DecryptTextProps {
  text: string;
  className?: string;
  speed?: number; // ms per frame
  delay?: number; // ms before starting
  onComplete?: () => void;
}

export default function DecryptText({
  text,
  className = "",
  speed = 30,
  delay = 0,
  onComplete,
}: DecryptTextProps) {
  const [display, setDisplay] = useState("");
  const frameRef = useRef(0);
  const lockedRef = useRef(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let timeout: ReturnType<typeof setTimeout>;

    timeout = setTimeout(() => {
      interval = setInterval(() => {
        frameRef.current += 1;

        // lock one more character every few frames
        if (frameRef.current % 3 === 0 && lockedRef.current < text.length) {
          lockedRef.current += 1;
        }

        const scrambled = text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < lockedRef.current) return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("");

        setDisplay(scrambled);

        if (lockedRef.current >= text.length) {
          clearInterval(interval);
          setDisplay(text);
          onComplete?.();
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <span className={className}>{display || "\u00A0"}</span>;
}