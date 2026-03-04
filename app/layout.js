import "./globals.css";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata = {
  title: "WildHer Adventures",
  description:
    "Ženski avanturistički brend u Bosni i Hercegovini — profesionalno vođene outdoor ture, wellbeing i zajednica.",
  icons: {
    icon: "/logo-icon-mark.png",
    apple: "/logo-icon-mark.png",
  },
};

export default async function RootLayout({ children }) {
  let locale = "bs";
  try {
    const headersList = await headers();
    locale = headersList.get("x-next-intl-locale") || locale;
  } catch {
    // Serverless/edge may not have headers in some contexts
  }

  return (
    <html lang={locale} className={`${plusJakarta.variable} ${playfair.variable}`}>
      <body className="antialiased font-sans text-wildher-text">
        {children}
      </body>
    </html>
  );
}
