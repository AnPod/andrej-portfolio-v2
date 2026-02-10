import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Andrej Podgorsek - AI Solution Architect",
  description: "AI Architect, Engineer & Product Manager with 20+ years building AI-powered products. Specialized in AI system architecture across manufacturing, automotive, healthcare, banking, and telecom industries.",
  keywords: ["AI Solution Architect", "AI Product Manager", "AI Engineer", "System Architecture", "Machine Learning", "Next.js", "TypeScript"],
  authors: [{ name: "Andrej Podgorsek" }],
  openGraph: {
    title: "Andrej Podgorsek - AI Solution Architect",
    description: "Building AI products that deliver real business value",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
