"use client";

import { useEffect, useState } from "react";

type WsMessage = {
  type: string;
  groupId: string;
  data: any[];
};

const WS_BASE = process.env.NEXT_PUBLIC_WEBSOCKET_URL!;

export function useOperatorStatusWS() {
  const [wsDataByGroup, setWsDataByGroup] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/ws/status`);

    ws.onopen = () => console.log("Operator WS connected");

    ws.onmessage = (event) => {
      const msg: WsMessage = JSON.parse(event.data);
      console.log("Operator WS message:", msg);

      if (msg.type === "staff" && msg.groupId && Array.isArray(msg.data)) {
        setWsDataByGroup((prev) => ({
          ...prev,
          [msg.groupId]: msg.data,
        }));
      }
    };

    ws.onerror = (e) => console.error("Operator WS error", e);
    ws.onclose = () => console.log("Operator WS closed");

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  return wsDataByGroup;
}
