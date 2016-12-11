let Worker = require('worker-loader?inline!./worker');

window.work = function() {
    let worker = new Worker();

    worker.onmessage = function(e) {
        console.log(e.data);
    };
};

