import { observer } from 'mobx-react';
import config from '../../state/config';
import cube from '../../state/cube';
import styles from './styles.scss';
import Face from './face.jsx';

@observer
export default class extends React.Component {

    render() {

        let { uFace, fFace, rFace, lFace, bFace, dFace } = cube;

        let width = 400 / 2;
        let height = 600 / 2;

        return <div className={styles.wrapper} style={{
            left: `calc(50% - ${width}px)`,
            top: `calc(50% - ${height}px)`,
        }}>
            <div className={styles.cube}
                style={{
                    transform: `scale(${config.scale})`,
                    transformOrigin: `${width}px ${height}px`
                }}>
                <Face face={uFace} left={-67} top={-46} transform={['matrix3d(0.742817, 0.228551, 0, -0.000975, -0.936814, 0.260552, 0, -0.000661, 0, 0, 1, 0, 152, 94, 0, 1)scale(1.05)','']}/>
                <Face face={fFace} left={0} top={220} transform={[
                    'rotate(26deg)skew(26deg)','']}/>
                <Face face={rFace} left={195} top={214} transform={[
                    'rotate(-26deg)skew(-26deg)','']}/>
            </div>
        </div>;
    }
}