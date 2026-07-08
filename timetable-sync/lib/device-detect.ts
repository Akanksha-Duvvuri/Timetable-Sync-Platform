export type Provider = "google" | "apple";

export function detectProvider(): Provider {
  if (typeof window === "undefined") return "google";

  const ua = window.navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isMac = /Macintosh/.test(ua) && "ontouchend" in document === false;

  return isIOS || isMac ? "apple" : "google";
}
