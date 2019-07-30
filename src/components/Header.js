import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faRadiationAlt } from '@fortawesome/free-solid-svg-icons';
import styles from "./Header.module.css";

class Header extends React.Component {
    render() {
        const icon = <FontAwesomeIcon icon={faCircle}  color={this.props.connected ? "#27ae60" : "#d35400"} />
        const connected = this.props.connected ? "Connected" : "Disconnected";
        return (
            <div className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.logo}>
                      <FontAwesomeIcon icon={faRadiationAlt} /> &nbsp;
                      Reactor
                    </div> 
                    
                    
                    <div className={styles.status}>
                        {connected} {icon}
                    </div>
                    
                    <div className={styles.links}>
                        <a href="/export" target="_blank">Export</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;
