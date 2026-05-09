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
  icons: { icon: "https://fav.farm/🥗" },
};

const themeScript = `(function(){var s=localStorage.getItem('admin-theme'),d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',s||(d?'dark':'light'));})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${bricolage.variable} ${jakarta.variable}`} suppressHydrationWarning>
        <SessionProvider>
          <AdminLayout>{children}</AdminLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
