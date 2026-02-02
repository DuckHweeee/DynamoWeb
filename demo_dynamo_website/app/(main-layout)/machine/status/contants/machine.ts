export const GROUP_WS_TYPE_MAP: Record<string, string> = {
    "1": "SI1-status",
    "2": "SI2-status",
    "3": "SI3-status",
}

export const MACHINE_STATUS_MAP: Record<
    string,
    { label: string; color: string }
> = {
    R1: { label: "RUN", color: "bg-green-500" },
    S1: { label: "STOP", color: "bg-red-500" },
    S2: { label: "SETUP", color: "bg-yellow-400" },
}