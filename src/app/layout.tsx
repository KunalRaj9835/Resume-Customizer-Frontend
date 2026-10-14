import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Resume Customizer", description: "Tailor your resume to a job description with AI, then review and download it." };
export default function Root({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
