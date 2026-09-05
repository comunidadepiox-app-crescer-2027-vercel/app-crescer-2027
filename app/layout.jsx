import localFont from "next/font/local";
import { Outfit } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { SplashCrescer } from "@/components/brand/SplashCrescer";
import "./globals.css";

const geometric = localFont({
  src: [
    { path: "../public/fonts/geometric-slabserif-500.woff2", weight: "500" },
    { path: "../public/fonts/geometric-slabserif-700.woff2", weight: "700" },
  ],
  variable: "--font-geometric",
  display: "swap",
});

const arcane = localFont({
  src: [{ path: "../public/fonts/arcane-nine-400.woff2", weight: "400" }],
  variable: "--font-arcane",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "Crescer, o Encontro da Família Católica",
  description:
    "Acompanhe as notícias, o cronograma do encontro e seja um Benfeitor da Fé. Comunidade de São Pio X, Campina Grande, PB.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${geometric.variable} ${arcane.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <SplashCrescer />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
