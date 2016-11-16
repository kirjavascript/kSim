let saveData = true;

export default function (obj, name) {

    let saved = localStorage.getItem(name);

    if (saved) {
        try {
            saved = JSON.parse(saved);

            Object
                .keys(saved)
                .forEach((prop) => {
                    if (Array.isArray(saved[prop])) {
                        obj[prop].replace(saved[prop]);
                    }
                    else if (typeof saved[prop] == 'object' && saved[prop]) {
                        Object.assign(obj[prop], saved[prop]);
                    }
                    else {
                        obj[prop] = saved[prop];
                    }
                });
        }
        catch(e) {
            console.error(`Error parsing localStorage JSON data: ${e}`);
        }
    }

    window.addEventListener('beforeunload', () => {
        saveData &&
        localStorage.setItem(name, JSON.stringify(obj));
    });    

}

export function clearStorage() {
    while(localStorage.key(0)) {
        localStorage.removeItem(localStorage.key(0));
    }
    saveData = false;
    location.reload();
}