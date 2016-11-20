import config from '../../../state/config.js';
import cube from '../../../state/cube.js';

// the acube.js API is really weird
import '!!script-loader!../../../lib/acube.js';
let { init, solve, stop } = window.__acube__;

init(config);

export default {
    solve() {
        solve(cube.acube);
    }
};