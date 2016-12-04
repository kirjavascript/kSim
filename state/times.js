export function timeStamp(time) {
    if (time === null) {
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

    let times = rawTimes.map((d) => d.time);

    return {
        list: times.map((d) => timeStamp(d)),
        bestIndex: times.indexOf(times.reduce((a,time) => {

            if (time) {
                return Math.min(a, time);
            }
            else return a;

        }, Infinity))
    };
}