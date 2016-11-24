import { init } from './init';

export default class extends React.Component {

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <div style={{
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            textAlign: 'center',
            position: 'absolute',
        }} ref={init} />;
    }
}