import path from 'path';

import { GlobalState } from '../model/index';

let state: GlobalState | undefined;
const DATA_PATH = path.join(path.resolve(__dirname, '../..'), 'data', 'data.json');

export default {
    state,
    DATA_PATH,
};
