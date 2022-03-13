export function getLocaleString(): string {
    return new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
}

export function getLocaleDate(time): string {
    return new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' });
}

export function getDateFromTime(time: number) {
    return new Date(time);
}
