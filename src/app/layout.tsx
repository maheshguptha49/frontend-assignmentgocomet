import { Figtree } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { ReduxProviders } from "./Components/redux/Providers";
import Navbar from "./Components/Navbar";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Frontend Assignment",
  description: "Go comet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body>
        <ReduxProviders>
          <Navbar />
          {children}
        </ReduxProviders>
      </body>
    </html>
  );
}
