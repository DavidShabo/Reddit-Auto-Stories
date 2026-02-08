import "./globals.css";

export const metadata = {
  title: "doomscrolling",
  description: "DOOM-themed doomscroll feed",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-doom-bg text-white">
        {/* global CRT overlays */}
        <div className="doom-vignette" />
        <div className="doom-crt" />
        {children}
      </body>
    </html>
  );
}
