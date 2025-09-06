import '@/app/globals.css';
import { Header } from '@/components/header';
import { AppProviders } from '@/providers/providers';
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mindBase",
  description: "A platform for managing your mind and ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-gray-900">
      <body
        className={`${openSans.variable} antialiased`}
      >
        <AppProviders>
          <Header />
          <main className="">
            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
