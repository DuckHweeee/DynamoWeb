// Utility functions for Group KPI week calculations

export function getWeekOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
}

export function getWeekRange(year: number, week: number): { start: Date; end: Date } {
    const firstDayOfYear = new Date(year, 0, 1);
    const daysToAdd = (week - 1) * 7 - firstDayOfYear.getDay();
    
    const start = new Date(year, 0, 1 + daysToAdd);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return { start, end };
}

export function formatWeekRange(year: number, week: number): string {
    const { start, end } = getWeekRange(year, week);
    return `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`;
}

export function getCurrentWeek(): number {
    return getWeekOfYear(new Date());
}

export function getWeeksInYear(year: number): number {
    const lastDayOfYear = new Date(year, 11, 31);
    return getWeekOfYear(lastDayOfYear);
}
