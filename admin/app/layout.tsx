import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AdminLayout } from "../components/AdminLayout";
import { SessionProvider } from "../components/SessionProvider";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Uptown Nutrition Admin",
  description: "Admin dashboard for Uptown Nutrition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${jakarta.variable}`}>
        <SessionProvider>
          <AdminLayout>{children}</AdminLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
