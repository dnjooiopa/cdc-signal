import fs from 'fs';
import path from 'path';
import { GlobalState } from './model';

let globalState: GlobalState | undefined;

export async function init() {
    const dataPath = path.join(__dirname, 'crypto_data.json');
    if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(
            dataPath,
            JSON.stringify({
                symbols: [],
                data: [],
            })
        );
    }
    globalState = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}
