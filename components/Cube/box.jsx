import { observer } from 'mobx-react';
import config from '#state/config';
import cube from '#state/cube';
import styles from './styles.scss';
import Face from './face.jsx';

@observer
export default class extends React.Component {

    render() {

        let { uFace, fFace, rFace, lFace, bFace, dFace } = cube;

        let width = 440 / 2;
        let height = 660 / 2;

        return <div className={styles.wrapper} style={{
            left: `calc(50% - ${width}px)`,
            top: `calc(50% - ${height}px)`,
        }}>
            <div className={styles.cube}
                style={{
                    transform: `scale(${config.scale/1.8})`,
                    transformOrigin: `${width}px ${height}px`
                }}>
                <Face face={uFace} left={0} top={0}/>
                <Face face={fFace} left={0} top={220}/>
                <Face face={rFace} left={220} top={220}/>
                <Face face={dFace} left={0} top={440}/>
                <Face face={lFace} left={-220} top={220}/>
                <Face face={bFace} left={440} top={220}/>
            </div>
        </div>;
    }
}