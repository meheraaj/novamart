import "./globals.css";
import AdminLayout from "@/components/AdminLayout";

export const metadata = {
  title: "NovaMart Admin",
  description: "Admin Panel for NovaMart",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
