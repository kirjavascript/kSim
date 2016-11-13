import { action, computed, observable, autorun } from 'mobx';

class Config {

    @observable opacity = 1;
    @observable scale = 1;
    @observable strokeWidth = 2;

}


let config = new Config();

if (__DEV__) {
    window.config = config;
}

export default config;