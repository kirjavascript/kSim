export function timeStamp(time) {
    if (~[null,Infinity].indexOf(time)) {
        return 'DNF';
    }
    let seconds = (time/1000).toFixed(2);
    let minutes = (seconds/60)|0;
    if (minutes) {
        seconds = (seconds%60).toFixed(2);
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return `${minutes}:${seconds}`;
    }
    else {
        return seconds;
    }
}

export function parseTimes(rawTimes) {

    let times = rawTimes.map((d) => d.time ? d.time : Infinity);

    let bestIndex = times.indexOf(Math.min(...times));
    let worstIndex = times.lastIndexOf(Math.max(...times));
    let best5 = bestN(5, times);
    let current5 = currentN(5, times);
    let best12 = bestN(12, times);
    let current12 = currentN(12, times);
    let best100 = bestN(100, times);
    let current100 = currentN(100, times);

    let list = times.map((time, i) => {
        let obj = {
            value: timeStamp(time)
        };

        // apply time attributes
        if (i == bestIndex) {
            obj.best = true;
        }
        if (best5 && i >= best5.index && i < best5.index+5) {
            obj.best5 = true;
            if (i == best5.index + best5.maxIndex) {
                obj.best5max = true;
            }
            else if (i == best5.index + best5.minIndex) {
                obj.best5min = true;
            }
        }

        return obj;
    });

    return {
        best5,
        current5,
        best12,
        current12,
        best100,
        current100,
        list
    };
}

function bestN(n, times) {
    if (times.length < n) {
        return null;
    }

    // get averages
    let arr = [];
    for (let i=0; i < times.length-(n-1); i++) {
        arr.push([...times].splice(i, 5));
    }

    // calculate averages
    arr = arr.map(getAvg);
    let averages = arr.map((d)=>d.average);

    let min = Math.min(...averages);
    let index = averages.indexOf(min);
    let { maxIndex, minIndex } = arr[index];

    return {
        time: timeStamp(min),
        index, maxIndex, minIndex
    };

}

function currentN(n, times) {
    if (times.length < n) {
        return null;
    }
    else {
        return timeStamp(getAvg([...times].splice(times.length-n, n)).average);
    }
}

function getAvg(times) {
    let maxIndex = times.indexOf(Math.max(...times));
    let minIndex = times.indexOf(Math.min(...times));

    times.splice(maxIndex, 1);
    times.splice(minIndex, 1);

    return {
        average: times.reduce((a,b) => a+b) / times.length,
        maxIndex, minIndex
    };
}