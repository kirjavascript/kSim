import { observer } from 'mobx-react';
import config from '#state/config';
import cube from '#state/cube';
import styles from './styles.scss';
import Face from './face';

@observer
export default class extends React.Component {

    render() {

        let { uFace, fFace, rFace, lFace, bFace, dFace } = cube;

        let width = 210 / 2;
        let height = 320 / 2;

        return <div className={styles.wrapper} style={{
            left: `calc(50% - ${width}px)`,
            top: `calc(50% - ${height}px)`,
        }}>
            <div className={styles.cube}
                style={{
                    transform: `scale(${config.scale})`,
                    transformOrigin: `${width}px ${height}px`
                }}>
                <Face face={rFace} left={116} top={65} transform={[`perspective(${220 * 3}px) rotateY(103deg) rotateZ(-40deg) scale(1.1)`, `${220 / 2}px 0px 0px`]} />
                <Face face={bFace} left={-20} top={-15} transform={['matrix3d(-1, -0, 0, -0, 0.172539, 0.907719, 0, 0.001372, 0, 0, 1, 0, 225, 19, 0, 1)','0px 0px 0px']} />
                <Face face={dFace} left={-10} top={127} transform={['matrix3d(1.045455, -0, 0, 0, 0.192513, -0.680481, 0, 0.001604, 0, 0, 1, 0, 5, 170, 0, 1)','0px 0px 0px']} />
                <Face face={lFace} left={-136} top={75} transform={[`perspective(${220 * 3}px) rotateY(-105deg) rotateZ(40deg) scale(1.1)`, `${220 / 2}px 0px 0px`]} />
                <Face face={uFace} left={0} top={0} transform={[`perspective(${220 * 3}px) rotateX(60deg)`, `${220 / 2}px 0px 0px`]} />
                <Face face={fFace} left={0} top={90} transform={[`perspective(${220 * 3}px) rotateX(-60deg)`, `${220 / 2}px ${220}px 0px`]} />
            </div>
        </div>;
    }
}