"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useMachineAlert } from "@/contexts/MachineAlertContext";

export default function MachineSocketListener() {
  const { setAlerts } = useMachineAlert();
  const alertedMachines = useRef<Set<string>>(new Set());

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws/users");
    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      // 🔒 CHẶN TẤT CẢ MESSAGE KHÔNG PHẢI STATUS
      if (payload.type !== "status") {
        return;
      }

      const data = payload.data;
      if (!Array.isArray(data)) return;

      data.forEach((item: any) => {
        const machineName = item.machineName;
        if (!machineName) return;

        const toastId = `machine-alert-${machineName}`;

        const isAlert =
          item.status !== "0" && item.processId == null;

        if (isAlert) {
          if (!alertedMachines.current.has(machineName)) {
            alertedMachines.current.add(machineName);

            setAlerts((prev: any[]) => [
              ...prev.filter(a => a.machineName !== machineName),
              {
                machineName,
                status: item.status,
                time: item.time,
              },
            ]);

            toast.error(
              `⚠️ Máy ${machineName} đang chạy nhưng CHƯA gán đơn`,
              {
                id: toastId,
                duration: Infinity,
                position: "top-center",
              }
            );
          }
        } else {
          if (alertedMachines.current.has(machineName)) {
            alertedMachines.current.delete(machineName);

            setAlerts((prev: any[]) =>
              prev.filter(a => a.machineName !== machineName)
            );

            toast.dismiss(toastId);
          }
        }
      });
    };

    ws.onerror = () => console.error("WebSocket error");
    ws.onclose = () => console.warn("WebSocket closed");

    return () => ws.close();
  }, []);

  return null;
}
