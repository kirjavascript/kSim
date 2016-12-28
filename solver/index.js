import solver from 'worker-loader?inline=only!./worker';

if (__DEV__) {
    window.work = function() {

        let worker = new solver();

        worker.onmessage = function(e) {
            console.info(e.data);
        };

    };

}




