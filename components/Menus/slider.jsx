import { observer } from 'mobx-react';
import styles from './styles.scss';

@observer
class Slider extends React.Component {

    constructor(props) {
        super(props);

        let { obj, accessor } = this.props;

        this.onChange = (e) => {
            obj[accessor] = +e.target.value;
        };
    }

    render() {

        let { name, obj, accessor, min=0, max=1, step=0.1, ...etc } = this.props;

        return <div className={styles.slide}>
            {name}
            <input type="range"
                min={min}
                step={step}
                value={obj[accessor]}
                onChange={this.onChange}
                max={max}
                {...etc} />
        </div>;
    }

}

export default Slider;