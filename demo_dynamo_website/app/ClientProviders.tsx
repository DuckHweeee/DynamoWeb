"use client";

import { Toaster } from "@/components/ui/sonner";
import { MachineAlertProvider } from "@/contexts/MachineAlertContext";
import MachineSocketListener from "@/components/MachineSocketListener";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MachineAlertProvider>
      <MachineSocketListener />
      {children}
      {/* <Toaster richColors position="top-center" /> */}
    </MachineAlertProvider>
  );
}
