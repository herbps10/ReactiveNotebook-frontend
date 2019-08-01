import React from 'react';
import { observer } from 'mobx-react';
import styles from './HelpPane.module.css';
import HelpModal from './HelpModal.js';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const HelpPane = observer(class HelpPane extends React.Component {
    constructor(props) {
        super(props)

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.store.helpTopic = "";
    }


    render() {
        const url = `http://localhost:5000/docs?query=${this.props.store.helpTopic}`;
        const iframe = this.props.store.helpTopic === "" ? (null) : (
            <>
                <FontAwesomeIcon icon={faTimesCircle} className={styles.close} onClick={this.onClick} />
                <iframe src={url} className={styles.iframe} />
            </>
        )
        return (
            <div className={["pane", styles.helpPane].join(" ")}>
                {iframe}
                <HelpModal store={this.props.store} />
            </div>
        );
    }
});

export default HelpPane;