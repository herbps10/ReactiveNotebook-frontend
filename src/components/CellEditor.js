import React from 'react';
import { observer } from 'mobx-react';

// Codemirror
import ReactCodeMirror from 'react-codemirror';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';
import '../lib/show-hint.js';
import '../lib/show-hint.css';
import suggest from '../suggest.js';

import styles from './Cell.module.css';

const CellEditor = observer(class CellEditor extends React.Component {
    constructor(props) {
        super(props);

        this.onKeyUp = this.onKeyUp.bind(this);
        this.autocomplete = this.autocomplete.bind(this);
        this.run = this.run.bind(this);
        this.update = this.update.bind(this);

        this.codeMirrorRef = React.createRef();

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

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.active === false && this.props.active === true) {
            if (this.codeMirrorRef.current != null) {
                this.codeMirrorRef.current.getCodeMirror().display.input.textarea.focus();
            }
        }
    }

    componentDidMount() {
      this.codeMirrorRef.current.focus();
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
    
    onKeyUp(e) {
        if (e.keyCode === 13 && e.shiftKey) {
            this.run();
            e.preventDefault();
            e.stopPropagation();
        }
    }
    
    run() {
        this.props.store.runCell(this.props.cell);
    }
    
    update(newValue) {
        this.props.cell.value = newValue;
    }

    render() {
        const mirrorClasses = [styles.mirror, this.props.active ? styles.mirrorActive : styles.mirrorInactive].join(' ');
        return (
            <ReactCodeMirror
                className={mirrorClasses}
                value={this.props.cell.value}
                onChange={this.update}
                options={this.codeMirrorOptions}
                ref={this.codeMirrorRef}
            />
        );
    }
});

export default CellEditor;