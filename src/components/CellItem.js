import React from 'react';
import { observer } from 'mobx-react';
import { Draggable } from 'react-beautiful-dnd';
import AddCellButton from './AddCellButton.js';
import Cell from '../stores/Cell.js';
import BarLoader from 'react-spinners/BarLoader';

// Renderers
import RMatrix from "../renderers/RMatrix.js";
import RImage from "../renderers/RImage.js";
import RHtmlWidget from '../renderers/RHtmlWidget.js';
import RMd from '../renderers/RMd.js';
import RFunction from '../renderers/RFunction.js';

// Codemirror
import ReactCodeMirror from 'react-codemirror';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';
import '../lib/show-hint.js';
import '../lib/show-hint.css';
import suggest from '../suggest.js';

// Katex
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTrashAlt, faGripLines } from '@fortawesome/free-solid-svg-icons';

// Styles
import styles from "./CellItem.module.css";


import ('codemirror/mode/r/r');

const CellItem = observer(class CellItem extends React.Component {
    constructor(props) {
        super(props);

        this.instance = null;

        this.state = { 
          active: this.props.cell.open || false
        };

        this.containerRef = React.createRef();
        this.resultRef = React.createRef();
        this.codeMirrorRef = React.createRef();
        this.activateRef = React.createRef();

        this.addCellBefore = this.addCellBefore.bind(this);
        this.addCellAfter = this.addCellAfter.bind(this);
        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);
        this.run = this.run.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onUpdateCell = this.onUpdateCell.bind(this);
        this.onResizeStop = this.onResizeStop.bind(this);
        this.autocomplete = this.autocomplete.bind(this);

        this.codeMirrorOptions = {
            viewportMargin: Infinity,
            lineNumbers: true,
            lineWrapping: true,
            mode: 'r',
            theme: 'idea',
            hintOptions: { 
              hint: suggest,
              completeSingle: false
            },
            extraKeys: {
                "Shift-Enter": this.run,
                "Tab": this.autocomplete
            },
        }
    }

    autocomplete() {
      const cm = this.codeMirrorRef.current.codeMirror;
      const cursor = cm.getCursor(), line = cm.getLine(cursor.line);
      console.log('line', line, line.match(/^\s+$/));
      if(!line.match(/^\s*$/)) {
        CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
      }
      else {
        CodeMirror.commands.insertTab(cm);
      }
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.onDocumentClick, false);
    }

    componentDidMount() {
      this.containerRef.current.addEventListener('update-cell', this.onUpdateCell, false);
      this.codeMirrorRef.current.focus();
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onDocumentClick, false);
        this.containerRef.current.removeEventListener('update-cell', this.onUpdateCell);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.active === false && this.state.active === true) {
            if (this.codeMirrorRef.current != null) {
                this.codeMirrorRef.current.getCodeMirror().display.input.textarea.focus();
            }
        }
    }

    onUpdateCell(e) {
      this.props.store.updateView(this.props.cell, e.detail);
    }

    onResizeStop(e, direction, refToElement, delta) {
      const newWidth = refToElement.clientWidth / refToElement.parentElement.clientWidth;
      this.props.store.updateSize(this.props.cell, { width: newWidth });
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
      this.setState({ active: this.props.cell.open });
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

    delete() {
        this.props.store.deleteCell(this.props.cell);
    }

    update(newValue) {
        this.props.cell.value = newValue;
    }

    run() {
        this.props.store.runCell(this.props.cell);
    }

    onKeyUp(e) {
        if (e.keyCode === 13 && e.shiftKey) {
            this.run();
            e.preventDefault();
            e.stopPropagation();
        }
    }

    renderHTML() {
        const cellHTML = { __html: this.props.cell.resultString() };
        return <div dangerouslySetInnerHTML = { cellHTML }
        />;
    }

    resultView() {
        if (this.props.cell.hasImage) return null;

        if (this.props.cell.RClass.includes("md") && this.props.cell.result.length > 0)
            return <RMd cell={this.props.cell} />;

        if (this.props.cell.RClass.includes("html"))
            return this.renderHTML();

        if(this.props.cell.RClass.includes("htmlwidget"))
          return <RHtmlWidget cell={this.props.cell} />

        if(this.props.cell.RClass.includes("view"))
          return (
            <div dangerouslySetInnerHTML = { { __html: this.props.cell.resultString() } } />
          );

        if(this.props.cell.RClass.includes("function"))
            return (
              <RFunction cell={this.props.cell} />
            );

        if (this.props.cell.RClass.includes("matrix")) {
            return <RMatrix cell={this.props.cell} />;
    }

    if (this.props.cell.RClass.includes("latex")) {
      return <BlockMath math={this.props.cell.resultString()} />;
    }

    const options = {
      readOnly: 'nocursor',
      mode: 'r',
      theme: 'idea',
      lineWrapping: false,
    };

    const value = (this.props.cell.name === "" || this.props.cell.name === undefined) ?
        this.props.cell.resultString()
        : this.props.cell.name + ": " + this.props.cell.resultString();

    if (this.resultRef.current != null) {
      this.resultRef.current.getCodeMirror().doc.setValue(value);
    }

    if(value == "" && this.props.cell.defaultCell == true) {
      return (<em>Press Shift-Enter to run the cell</em>);
    }
    return (
      <div className={styles.resultContainer}>
        <ReactCodeMirror ref={this.resultRef} value={value} options={options} />
      </div>
    )
  }

  render() {
    const image = this.props.cell.hasImage ? (
      <RImage cell={this.props.cell} onImageLoad={this.onImageLoad} lastUpdate={this.props.cell.lastUpdate} onResizeStop={this.onResizeStop} />
    ) : null;

    const result = this.props.cell.error === "" ? this.resultView() : null;
    const error = this.props.cell.error === "" ? null : (
      <div className={styles.error}>{this.props.cell.error}</div>
    );

    const cellClasses = [styles.cell, this.state.active ? styles.active : null].join(' ');
    const mirrorClasses = [styles.mirror, this.state.active ? styles.mirrorActive : styles.mirrorInactive].join(' ');

    const loader = (
      <BarLoader loading={true} css={{ visibility: this.props.cell.loading ? 'visible' : 'hidden'}} color={'#3498db'} height={2} />
    );

    return (
      <div ref={this.containerRef}>
        <Draggable key={this.props.cell.id} draggableId={`draggable-${this.props.cell.id}`} index={this.props.index}>
          {(provided, snapshot) => (
            <div className={cellClasses}
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              <div className={styles.activate} onClick={this.onClick} ref={this.activateRef} />
              <div className={styles.columns}>
                <AddCellButton onClick={this.addCellBefore} className={[styles.addCellBefore, styles.addCell, styles.buttonColor].join(' ')} />
                <div className={styles.grip}>
                  <a className={styles.gripHandle} {...provided.dragHandleProps}></a>
                </div>

                <div className={styles.editor}>
                  <ReactCodeMirror
                    className={mirrorClasses}
                    value={this.props.cell.value}
                    onChange={this.update}
                    options={this.codeMirrorOptions}
                    ref={this.codeMirrorRef} />

                  <div className={[styles.result, this.props.cell.loading ? styles.loading : styles.loaded].join(' ')}>
                    {loader}
                    {error}
                    {result}
                    {image}
                  </div>

                  <div className={styles.actions}>
                    <button onClick={this.run} className={styles.buttonColor}><FontAwesomeIcon icon={faPlay} /></button>
                    <button onClick={this.delete} className={styles.buttonColor}><FontAwesomeIcon icon={faTrashAlt} /></button>
                  </div>
                </div>
                <AddCellButton onClick={this.addCellAfter} className={[styles.addCellAfter, styles.addCell, styles.buttonColor].join(' ')} />
              </div>
              <div className={styles.spacer} />
            </div>
          )}
        </Draggable>
      </div>
    )
  }
});

export default CellItem;