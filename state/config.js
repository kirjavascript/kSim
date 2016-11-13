import { action, computed, observable, autorun } from 'mobx';

class Config {

    @observable opacity = 1;
    @observable scale = 1;
    @observable faceletBorder = 1;
    @observable keymapArray = [];
    @observable menus = {
        display: 1,
        keymap: 1,
        movelog: 1
    };

    @computed get keymap() {
        let keys = {};
        this.keymapArray.forEach((map) => {
            keys[map[0]] = map[1];
        });
        return keys;
    }

}


let config = new Config();

if (__DEV__) {
    window.config = config;
}

export default config;