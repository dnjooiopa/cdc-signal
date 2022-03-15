import path from 'path';

import { GlobalState } from '../model/index';

let state: GlobalState | undefined;
const DATA_PATH = path.join(path.resolve(__dirname, '../..'), 'data', 'data.json');
const info = `
✅ Available commands:
\`- time\`
\`- update\`
\`- signal\`
\`- add EXCHANGE SYMBOL\`
\`- remove EXCHANGE SYMBOL\`
`;

export default {
    state,
    DATA_PATH,
    info,
};
