import React from 'react';
import { Resizable } from 're-resizable';
import styles from "./RImage.module.css";

const RImage = ({ cell, onImageLoad, onResizeStop }) => {
    console.log(cell);
    const defaultSize = {
        width: cell.viewWidth != null ? (cell.viewWidth * 100) + "%" : "50%",
        height: cell.viewHeight != null ? (cell.viewHeight * 100) + "%" : "50%",
    }

    console.log(defaultSize);

    return (
        <Resizable
            defaultSize={defaultSize}
            className={styles.resizable}
            lockAspectRatio={true}
            onResizeStop={onResizeStop}>
            <img
                src={`http://localhost:5000/output/${cell.id}.svg?${cell.lastUpdate}`}
                onLoad={onImageLoad}
                className={styles.image} 
                alt="" />
        </Resizable>
        )
 };

export default RImage;
