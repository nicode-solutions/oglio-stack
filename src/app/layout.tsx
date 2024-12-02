import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const defaultFont = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "OglioStack",
    description: "A starter app with Next.js, React, Typescript and Supabase.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={defaultFont.className}
            >
                {children}
            </body>
        </html>
    );
}
