import type { Metadata } from "next";
import "./globals.css";
import { ReduxProviders } from "./Components/redux/Providers";

export const metadata: Metadata = {
  title: "Frotnend Assignment",
  description: "Saas Labs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProviders>{children}</ReduxProviders>
      </body>
    </html>
  );
}
