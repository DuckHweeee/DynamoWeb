"use client";
import { useEffect, useState } from "react";
type WsMessage = {
  type: string;
  groupId: string;
  data: any[];
};

const WS_BASE = process.env.NEXT_PUBLIC_WEBSOCKET_URL!;

export function useGroupStatusWS() {
  const [wsDataByGroup, setWsDataByGroup] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/ws/status`);

    ws.onmessage = (event) => {
      const msg: WsMessage = JSON.parse(event.data);
      if (msg.type === "GROUP_STATUS" && msg.groupId && Array.isArray(msg.data)) {
        setWsDataByGroup((prev) => ({
          ...prev,
          [msg.groupId]: msg.data,
        }));
      }
    };

    // ws.onerror = (e) => console.error("WS error", e);
    // ws.onclose = () => console.log("WS closed");

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  return wsDataByGroup;
}
