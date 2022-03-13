import fs from 'fs';

export function saveFile(path: string, data: string) {
    fs.writeFileSync(path, data);
}

export function readFile(path: string): string {
    return fs.readFileSync(path, 'utf8');
}

export function fileExists(path: string): boolean {
    return fs.existsSync(path);
}
