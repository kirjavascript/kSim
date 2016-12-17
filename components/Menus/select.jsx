import DownIcon from 'react-icons/lib/go/chevron-down';
import styles from './select.scss';

class Select extends React.Component {

    constructor(props) {
        super(props);
        this.nativeInput = (e) => {
            this.props.onSelect(e.target.value);
        };
    }

    render() {

        let { value, options, ...attrs} = this.props;

        return <div className={styles.wrapper} {...attrs}>
            <div className={styles.arrow}>
                <DownIcon/>
            </div>

            <select
                value={value}
                onChange={this.nativeInput}
                onKeyPress={() => console.log('asd')}>
                {options
                    .map((option) => ({value:option[0],text:option[1]}))
                    .map((option,i) => (
                    <option key={i} value={option.value}>
                        {option.text}
                    </option>
                ))}
            </select>
        </div>;
    }

}

export default Select;