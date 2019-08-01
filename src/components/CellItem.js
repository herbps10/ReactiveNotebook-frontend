import React from 'react';
import { observer } from 'mobx-react';
import { Draggable } from 'react-beautiful-dnd';
import AddCellButton from './AddCellButton.js';
import Cell from '../stores/Cell.js';
import CellResult from './CellResult.js'
import CellEditor from './CellEditor.js';
import CellActions from './CellActions.js';

// Styles
import styles from "./Cell.module.css";

const CellItem = observer(class CellItem extends React.Component {
    constructor(props) {
        super(props);

        this.instance = null;

        this.containerRef = React.createRef();
        this.activateRef = React.createRef();

        this.addCellBefore = this.addCellBefore.bind(this);
        this.addCellAfter = this.addCellAfter.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onUpdateCell = this.onUpdateCell.bind(this);
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.onDocumentClick, false);
    }

    componentDidMount() {
      this.containerRef.current.addEventListener('update-cell', this.onUpdateCell, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onDocumentClick, false);
        this.containerRef.current.removeEventListener('update-cell', this.onUpdateCell);
    }

    

    onUpdateCell(e) {
      this.props.store.updateView(this.props.cell, e.detail);
    }

    onDocumentClick(e) {
        //if(e.target.isEqualNode(this.activateRef.current)) return;
        //if(!this.containerRef.current.contains(e.target)) this.setState({ active: false });
    }

    onClick(e) {
      this.toggleActive();
    }

    toggleActive() {
      this.props.cell.open = !this.props.cell.open;
      this.props.store.updateOpen(this.props.cell, { open: this.props.cell.open });
    }

    addCellAfter() {
        const newCell = new Cell("", "");
        newCell.open = true;
        this.props.store.addCellAfter(this.props.cell, newCell);
    }

    addCellBefore() {
        const newCell = new Cell("", "");
        newCell.open = true;
        this.props.store.addCellBefore(this.props.cell, newCell);
    }
    

  render() {
    const cellClasses = [styles.cell, this.props.cell.open ? styles.active : null].join(' ');

    return (
      <div ref={this.containerRef} className={this.props.className}>
        <Draggable key={this.props.cell.id} draggableId={`draggable-${this.props.cell.id}`} index={this.props.index}>
          {(provided, snapshot) => (
            <div className={cellClasses}
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              <div className={styles.columns}>

                <AddCellButton onClick={this.addCellBefore} className={[styles.addCellBefore, styles.addCell, styles.buttonColor].join(' ')} />

                <div className={styles.grip}>
                  <a className={styles.gripHandle} {...provided.dragHandleProps}></a>
                </div>

                <div className={styles.editor}>
                  <CellEditor
                    cell={this.props.cell}
                    store={this.props.store}
                    active={this.props.cell.open} />

                  <CellResult cell={this.props.cell} store={this.props.store} />

                  <CellActions cell={this.props.cell} store={this.props.store} />
                </div>
                <AddCellButton onClick={this.addCellAfter} className={[styles.addCellAfter, styles.addCell, styles.buttonColor].join(' ')} />
              </div>
            </div>
          )}
        </Draggable>
      </div>
    )
  }
});

export default CellItem;