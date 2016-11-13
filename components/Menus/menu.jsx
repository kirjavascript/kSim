import { observer } from 'mobx-react';
import { Motion, spring } from 'react-motion';
import styles from './styles.scss';

import DownIcon from 'react-icons/lib/go/chevron-down';
import RightIcon from 'react-icons/lib/go/chevron-right';
import config from '../../state/config';

@observer
class Menu extends React.Component {

    constructor(props) {
        super(props);

        this.toggle = () => {
            config.menus[this.props.name] = config.menus[this.props.name]^1;
        };
        this.bodyHeight = 200;
        this.startsClosed = config.menus[this.props.name] == 0;
    }

    setBodyHeight = (node) => {
        if (node) {
            this.bodyHeight = node.getBoundingClientRect().height;
        }
    }

    bodyinit = (node) => {
        if (config.menus[this.props.name] == 0) {
            node.style.display = 'none';
            setTimeout(() => {
                node.style.display = 'block';
            }, 1000);
        }
    }

    render() {

        let open = !!config.menus[this.props.name];

        return <div className={styles.menu}>

            <div
                onClick={this.toggle}
                className={styles.title}>
                <h2>{this.props.title}</h2>
                {open ? <DownIcon/> : <RightIcon/>}
            </div>

            <div className={styles.bodywrap} ref={this.bodyinit}>
                <Motion
                    defaultStyle={{marginTop:0, opacity: 1}}
                    style={{
                        marginTop: spring(open?0:-this.bodyHeight),
                        opacity: spring(open)
                    }}>
                    {(style) => <div
                        ref={this.setBodyHeight}
                        style={{
                            ...style,
                            display: !style.opacity ? 'none' : 'block'
                        }}
                        className={styles.body}>
                        {this.props.children}
                    </div>}
                </Motion>
            </div>

        </div>;
    }
}

export default Menu;