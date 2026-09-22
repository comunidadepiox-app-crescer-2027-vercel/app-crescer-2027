import localFont from "next/font/local";
import { Outfit } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthProvider";
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
  title: "Crescer Admin",
  description: "Mesa de trabalho da equipe de comunicação do Crescer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${geometric.variable} ${arcane.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
