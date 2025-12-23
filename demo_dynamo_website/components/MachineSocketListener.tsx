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

            payload.data?.forEach((item: any) => {
                if (item.status !== "0" && item.drawingCodeName == null) {
                    const machineName = item.machineDto?.machineName;

                    // chống spam alert
                    if (!alertedMachines.current.has(machineName)) {
                        alertedMachines.current.add(machineName);

                        setAlerts((prev: any) => [
                            ...prev,
                            {
                                machineName,
                                status: item.status,
                                time: item.time,
                            },
                        ]);

                        toast.error(
                            `⚠️ Máy ${machineName} đang chạy nhưng CHƯA gán đơn`,
                            {
                                duration: Infinity,
                                position: "top-center"
                            },
                        );
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
