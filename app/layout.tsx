import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import zoneInLogo from "./Zoneinlogo.png";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "ZoneIn",
  description: "Find the best zones for gig drivers",
  icons: {
    icon: zoneInLogo.src,
    apple: zoneInLogo.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-[#FAFAFA] font-body-md text-on-surface antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
