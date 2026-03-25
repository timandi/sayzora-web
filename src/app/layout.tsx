import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sayzora Hospitality – Premium Apartments in Tenerife",
  description: "Premium short-term rental apartments in Las Americas, Los Cristianos & Torres del Sol, Tenerife. Book direct for the best rates.",
  openGraph: {
    title: "Sayzora Hospitality",
    description: "Premium apartments in Tenerife — where comfort meets the ocean breeze.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
