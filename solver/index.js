import solver from 'worker-loader!./worker';

window.work = function() {

    let worker = new solver();

    worker.onmessage = function(e) {
        console.log(e.data);
    };


};