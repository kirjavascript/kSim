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

    return {
        list: times.map((d) => timeStamp(d)),
        bestIndex: times.indexOf(Math.min(...times)),
        worstIndex: times.lastIndexOf(Math.max(...times)),
        best5: bestN(5, times),
        current5: currentN(5, times),
        best12: bestN(12, times),
        current12: currentN(12, times),
        best100: bestN(100, times),
        current100: currentN(100, times),
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

    let min = Math.min(...arr);

    return {
        time: timeStamp(min),
        index: arr.indexOf(min)
    };

}

function currentN(n, times) {
    if (times.length < n) {
        return null;
    }
    else {
        return timeStamp(getAvg([...times].splice(times.length-n, n)));
    }
}

function getAvg(times) {
    let max = Math.max(...times);
    let min = Math.min(...times);

    times.splice(times.indexOf(max), 1);
    times.splice(times.indexOf(min), 1);

    return times.reduce((a,b) => a+b) / times.length;
}

//yellow, green, red
// grey background for best 5