import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Timetable Sync",
  description: "Sync your class schedule directly to your calendar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
