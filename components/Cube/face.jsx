import { observer } from 'mobx-react';
import SASSVars from '!!sass-variables!../variables.scss';

import config from '../../state/config';

@observer
class Face extends React.Component {

    render() {

        let { opacity, faceletBorder } = config;

        let { face, type, gap=15, size=220 } = this.props;

        let stickerSize = size/3 - gap;

        let [transform, transformOrigin] = this.props.transform || [];

        return <svg style={{
            opacity: opacity,
            width: size,
            height: size,
            transformOrigin,
            transform,
            top: this.props.top,
            left: this.props.left,
        }}>
            {face.map((facelet, i) => {
                return <rect 
                    key={i}
                    x={(i%3) * (stickerSize + gap)}
                    y={((i/3)|0) * (stickerSize + gap)}
                    width={stickerSize}
                    height={stickerSize}
                    stroke={SASSVars.grey}
                    strokeWidth={faceletBorder?2:0}
                    strokeOpacity={1}
                    fill={facelet}/>;
            })}
        </svg>;
    }

}

export default Face;