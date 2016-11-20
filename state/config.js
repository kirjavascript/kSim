import { action, computed, observable, autorun } from 'mobx';
import storage from './storage';

class Config {

    @observable opacity = 1;
    @observable scale = 1;
    @observable faceletBorder = 1;
    @observable keymapArray = [];
    @observable menus = {
        display: 1,
        keymap: 0,
        movelog: 1,
        timer: 1,
        about: 1,
        solver: 1
    };

    @observable acube = {
        status: 'idle',
        output: '',
        slices: 0,
        all: 0,
        optimal: 0,
        metric: 'FTM'
    }

    @computed get keymap() {
        let keys = {};
        this.keymapArray.forEach((map) => {
            keys[map[0]] = map[1];
        });
        return keys;
    }

}


let config = new Config();

// load / save to localStorage
storage(config, 'config');

if (__DEV__) {
    window.config = config;
}

export default config;