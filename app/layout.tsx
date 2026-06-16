import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/Toast";
import { PageTransition } from "@/components/ui/PageTransition";
import { IntroAnimation } from "@/components/features/IntroAnimation";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hopeacademy.az"),
  title: {
    default: "Hope Academy",
    template: "%s | Hope Academy",
  },
  description: "Bakıdan bütün dünyaya — təhsil məsləhəti və müraciət platforması",
  openGraph: {
    title: "Hope Academy",
    description: "Bakıdan bütün dünyaya — təhsil məsləhəti və müraciət platforması",
    siteName: "Hope Academy",
    locale: "az_AZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hope Academy",
    description: "Bakıdan bütün dünyaya — təhsil məsləhəti və müraciət platforması",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <ScrollProgress />
        <ScrollToTop />
        <IntroAnimation />
        <AuthProvider>
          <ToastProvider>
            <PageTransition>{children}</PageTransition>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
