import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Library",
  description: "A collection of my deployed web applications",
  icons: {
    icon: "/images/188987.png",
    apple: "/images/188987.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#f8f9fa] text-gray-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
