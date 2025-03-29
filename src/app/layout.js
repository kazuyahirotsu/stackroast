import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeController from '@/components/ThemeController';
import "devicon/devicon.min.css";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RoastMyStack - AI Tech Stack Critic",
  description: "Get your tech stack roasted by AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeController />
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-base-200">
            <div className="container mx-auto p-4 flex justify-between items-center">
              <a href="/" className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span className="font-bold text-xl">RoastMyStack</span>
              </a>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="border-t border-base-200 py-6">
            <div className="container mx-auto px-4 text-center">
              
              <div className="flex justify-center mb-4">
                <a 
                  href="https://www.buymeacoffee.com/kazuyahirotsu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <img 
                    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
                    alt="Buy Me A Coffee" 
                    style={{ height: '60px', width: '217px' }} 
                  />
                </a>
              </div>
              <p className="text-sm text-base-content/70 mt-4">
                RoastMyStack - Built with Next.js, Supabase and DaisyUI
              </p>

            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
