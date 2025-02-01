import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Transcribely - Audio to Text Transcription",
    template: "%s | Transcribely"
  },
  description: "Convert audio to text with high accuracy using advanced AI technology. Real-time transcription with easy editing and export options.",
  keywords: [
    "audio transcription",
    "speech to text",
    "voice recognition",
    "audio to text",
    "transcription service",
    "AI transcription"
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Transcribely - Audio to Text Transcription",
    description: "Convert audio to text with high accuracy using advanced AI technology. Real-time transcription with easy editing and export options.",
    siteName: "Transcribely",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "Transcribely Logo"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "Transcribely - Audio to Text Transcription",
    description: "Convert audio to text with high accuracy using advanced AI technology.",
    images: ["/favicon.png"]
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}