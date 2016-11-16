import { observer } from 'mobx-react';
import styles from './styles.scss';
import SASSVars from '!!sass-variables!../variables.scss';

@observer
class Checkbox extends React.Component {

    constructor(props) {
        super(props);

        this.toggle = () => {
            this.props.onToggle(!this.props.checked);
        };
    }

    render() {

        return <div className={this.props.className}>
            <span style={{paddingRight: 5}}>{this.props.label}</span>
            <svg viewBox="0 0 40 40" width="15" height="15" display="inline-block" onClick={this.toggle} style={{cursor:'pointer',marginBottom:-3}}>
                <rect x="0" y="0" fill={SASSVars.lightgrey} width="40" height="40" rx="10"/>
                {this.props.checked && <path fill={SASSVars.white} transform="scale(0.75) translate(7 7)" d="M37.3 12.6q0 1-.6 1.6l-19.2 19q-.6.8-1.5.8t-1.6-.7l-11-11q-.7-.7-.7-1.6t.6-1.5l3-3q.7-.7 1.6-.7t1.4.7l6.6 6.6L30.6 8q.6-.5 1.5-.5t1.6.6l3 3q.7.7.7 1.6z"/>}
            </svg>
        </div>;
    }

}

export default Checkbox;