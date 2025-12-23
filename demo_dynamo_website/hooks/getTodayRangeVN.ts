// VN timezone helper (local time)
export const getStartOfDayVN = (date: Date): number => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
};

export const getEndOfDayVN = (date: Date): number => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d.getTime();
};