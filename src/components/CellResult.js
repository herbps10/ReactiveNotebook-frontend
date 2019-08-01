import React from 'react';
import { observer } from 'mobx-react';

// Renderers
import RImage from '../renderers/RImage.js';
import RMatrix from "../renderers/RMatrix.js";
import RHtmlWidget from '../renderers/RHtmlWidget.js';
import RMd from '../renderers/RMd.js';
import RFunction from '../renderers/RFunction.js';

// Katex
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Codemirror
import ReactCodeMirror from 'react-codemirror';

// Bar loader
import BarLoader from 'react-spinners/BarLoader'

import styles from "./Cell.module.css";

const CellResult = observer(class CellResult extends React.Component {
    constructor(props) {
        super(props);

        this.onResizeStop = this.onResizeStop.bind(this);

        this.resultRef = React.createRef();
    }

    onResizeStop(e, direction, refToElement, delta) {
      const newWidth = refToElement.clientWidth / refToElement.parentElement.clientWidth;
      this.props.cell.viewWidth = newWidth;
      this.props.store.updateSize(this.props.cell, { width: newWidth });
    }

    results() {
        // Display image
        if(this.props.cell.hasImage) return (
            <RImage cell={this.props.cell} onImageLoad={this.onImageLoad} lastUpdate={this.props.cell.lastUpdate} onResizeStop={this.onResizeStop} />
        );

        // Markdown
        if (this.props.cell.RClass.includes("md") && this.props.cell.result.length > 0)
            return <RMd cell={this.props.cell} />;

        // Raw HTML
        if (this.props.cell.RClass.includes("html"))
            return this.renderHTML();

        // htmlwidget
        if(this.props.cell.RClass.includes("htmlwidget"))
          return <RHtmlWidget cell={this.props.cell} />

        // Reactor view
        if(this.props.cell.RClass.includes("view"))
          return (
            <div dangerouslySetInnerHTML = { { __html: this.props.cell.resultString() } } />
          );

        // R function
        if(this.props.cell.RClass.includes("function"))
            return (
              <RFunction cell={this.props.cell} />
            );

        // R matrix
        if (this.props.cell.RClass.includes("matrix")) {
            return <RMatrix cell={this.props.cell} />;
        }

        // Latex
        if (this.props.cell.RClass.includes("latex")) {
            return <BlockMath math={this.props.cell.resultString()} />;
        }

        //
        // All other forms of output
        //

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
        const result = this.props.cell.error === "" ? this.results() : null;
        const error = this.props.cell.error === "" ? null : (
            <div className={styles.error}>{this.props.cell.error}</div>
        );

        const loader = (
            <BarLoader loading={true} css={{ visibility: this.props.cell.loading ? 'visible' : 'hidden'}} color={'#3498db'} height={2} />
        );

        return (
            <div className={[styles.result, this.props.cell.loading ? styles.loading : styles.loaded].join(' ')}>
                {loader}
                {error}
                {result}
            </div>
        );
    }
});

export default CellResult;