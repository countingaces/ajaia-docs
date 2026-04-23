import "./globals.css";

export const metadata = {
  title: "Ajaia Docs",
  description: "Lightweight collaborative document editor",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
