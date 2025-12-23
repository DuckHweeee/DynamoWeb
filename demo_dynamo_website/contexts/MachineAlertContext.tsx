"use client";

import { createContext, useContext, useState } from "react";

export type MachineAlert = {
  machineName: string;
  status: string;
  time: string;
};

const MachineAlertContext = createContext<any>(null);

export const MachineAlertProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [alerts, setAlerts] = useState<MachineAlert[]>([]);

  return (
    <MachineAlertContext.Provider value={{ alerts, setAlerts }}>
      {children}
    </MachineAlertContext.Provider>
  );
};

export const useMachineAlert = () => useContext(MachineAlertContext);
