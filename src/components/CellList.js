import React from 'react';
import { observer } from 'mobx-react';
import { Droppable } from 'react-beautiful-dnd';
import CellItem from './CellItem.js';
import styles from "./CellList.module.css";

const CellList = observer(class CellList extends React.Component {
    constructor(props) {
        super(props);

        this.activate = this.activate.bind(this);
    }

    activate(cell) {
        cell.open = !cell.open;
        this.props.store.updateOpen(cell, { open: cell.open });
    }

    render() {
        const cells = this.props.store.cells.map((cell, index) => (
            <div key={cell.id} className={styles.row}>
                <div className={styles.activate} onClick={ () => this.activate(cell) } />
                <CellItem cell={cell} store={this.props.store} key={cell.id} index={index} className={styles.cell} />
            </div>
        ) );

        return (
            <Droppable droppableId="cell-droppable">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={[styles.cells, this.props.className].join(' ')}
                    >
                        {cells}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        );
    }
});

export default CellList;
