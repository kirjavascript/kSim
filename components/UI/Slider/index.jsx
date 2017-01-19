import { observer } from 'mobx-react';
import styles from './styles.scss';

@observer
class Slider extends React.Component {

    constructor(props) {
        super(props);

        let { obj, accessor, reset } = this.props;

        this.onChange = (e) => {
            if (this.props.onMutate) {
                this.props.onMutate(+e.target.value);
            }
            obj[accessor] = +e.target.value;
        };

        this.reset = () => {
            obj[accessor] = reset;
        };
    }

    render() {

        let { name, obj, accessor, min=0, max=1, step=0.1, reset, ...etc } = this.props;

        let hasReset = typeof reset != 'undefined';

        return <div className={styles.slide}>
            {name}
            {hasReset &&
                <button onClick={this.reset} style={{
                    opacity: obj[accessor] != reset ? 1 : 0.5
                }}>reset</button>}
            <input type="range"
                min={min}
                step={step}
                value={obj[accessor]}
                onChange={this.onChange}
                max={max} />
                
        </div>;
    }

}

export default Slider;