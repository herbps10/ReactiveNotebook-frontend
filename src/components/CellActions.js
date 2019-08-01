import React from 'react';

import styles from "./Cell.module.css";

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

class CellActions extends React.Component {
    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
        this.run = this.run.bind(this);
    }

    delete() {
        this.props.store.deleteCell(this.props.cell);
    }

    run() {
        this.props.store.runCell(this.props.cell);
    }

    render() {
        return(
            <div className={styles.actions}>
                <button onClick={this.run} className={styles.buttonColor}><FontAwesomeIcon icon={faPlay} /></button>
                <button onClick={this.delete} className={styles.buttonColor}><FontAwesomeIcon icon={faTrashAlt} /></button>
            </div>
        );
    }
}

export default CellActions;