import path from 'path';

import global from './global';
import { update } from './utils';
import { fileExists, readFile, saveFile } from './utils/file';

export async function init() {
    if (!fileExists(global.DATA_PATH)) {
        const defaultData = readFile(path.join(__dirname, 'data.default.json'));
        saveFile(global.DATA_PATH, defaultData);
    }
    global.state = JSON.parse(readFile(global.DATA_PATH));
    await update();
}
