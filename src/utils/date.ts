export function getLocaleString(): string {
    return new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
}

export function getLocaleDate(): string {
    return new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' });
}

export function getDateFromTime(time: number): string {
    return new Date(time).toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' });
}
