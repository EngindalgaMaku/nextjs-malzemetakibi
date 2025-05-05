import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css"; // Adjust path if needed

const inter = Inter({ subsets: ["latin"] });

// Optional: Add metadata specific to auth pages if desired
// export const metadata: Metadata = {
//   title: "Giriş Yap", 
// };

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // No lang="tr" needed here as it's inherited from RootLayout's <html>
    // Apply overflow-hidden to the body for this layout
    <body className={`${inter.className} overflow-hidden`}>
      {children} 
    </body>
  );
} 