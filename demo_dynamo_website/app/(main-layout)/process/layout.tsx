import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function TbaletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const isPlannedProcess = pathname.startsWith("/process");
  // const isUnPlannedProcesse = !isPlannedProcess && pathname.startsWith("/process/unplannedProcess");

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

      <div className="m-2 px-4 py-1 bg-white rounded-[10px] shadow">
        {children}
      </div>
    </div>
  );
}
