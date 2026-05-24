import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Project Library",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
