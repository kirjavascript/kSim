import { observer } from 'mobx-react';
import SASSVars from '!!sass-variables!../variables.scss';
import styles from './styles.scss';

@observer
class CubeUI extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let { uFace, fFace, rFace, lFace, bFace, dFace } = this.props.cube;

        return <div className={styles.wrapper}>
            <div className={styles.cube}>
                <Face face={rFace} type="R" />
                <Face face={bFace} type="B" />
                <Face face={dFace} type="D" />
                <Face face={lFace} type="L" />
                <Face face={uFace} type="U" />
                <Face face={fFace} type="F" />
            </div>
        </div>;
    }
}

@observer
class Face extends React.Component {

    pos = {
        U: { left: 0, top: 0 },
        F: { left: 0, top: 90 },
        R: { left: 116, top: 65 },
        L: { left: -136, top: 75 },
        B: { left: -20, top: -15 },
        D: { left: -10, top: 127 }
    }

    render() {

        let { face, type, gap=15, size=220 } = this.props;

        let stickerSize = size/3 - gap;

        let { left, top } = this.pos[type];

        let [transform, transformOrigin] = {
            'U': [`perspective(${size * 3}px) rotateX(60deg)`, `${size / 2}px 0px 0px`],
            'F': [`perspective(${size * 3}px) rotateX(-60deg)`, `${size / 2}px ${size}px 0px`],
            'R': [`perspective(${size * 3}px) rotateY(103deg) rotateZ(-40deg) scale(1.1)`, `${size / 2}px 0px 0px`],
            'B': ['matrix3d(-1, -0, 0, -0, 0.172539, 0.907719, 0, 0.001372, 0, 0, 1, 0, 225, 19, 0, 1)','0px 0px 0px'],
            'D': ['matrix3d(1.045455, -0, 0, 0, 0.192513, -0.680481, 0, 0.001604, 0, 0, 1, 0, 5, 170, 0, 1)','0px 0px 0px'],
            'L': [`perspective(${size * 3}px) rotateY(-105deg) rotateZ(40deg) scale(1.1)`, `${size / 2}px 0px 0px`]
        }[type];

        return <svg style={{
            opacity: 1,
            width: size,
            height: size,
            transformOrigin,
            transform,
            left, top
        }}>
            {face.map((facelet, i) => {
                return <rect 
                    key={i}
                    x={(i%3) * (stickerSize + gap)}
                    y={((i/3)|0) * (stickerSize + gap)}
                    width={stickerSize}
                    height={stickerSize}
                    stroke={SASSVars.grey}
                    strokeWidth={2}
                    fill={facelet}/>;
            })}
        </svg>;
    }

}

export default CubeUI;