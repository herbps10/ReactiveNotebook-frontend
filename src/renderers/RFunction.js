import React from 'react';
import { observer } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import ReactCodeMirror from 'react-codemirror';
import styles from './RFunction.module.css';

const RFunction = observer(class RFunction extends React.Component {
    constructor(props) {
        super(props)
        this.state = { open: false };
        this.onClick = this.onClick.bind(this);
        this.editorRef = React.createRef();
    }

    onClick() {
        this.setState({ open: !this.state.open });
    }

    getValue() {
        return this.props.cell.value;
    }

    componentDidUpdate() {
        if (this.editorRef.current != null) {
            this.editorRef.current.getCodeMirror().doc.setValue(this.getValue());
        }
    }

    render() {
        const options = {
            readOnly: 'nocursor',
            mode: 'r',
            theme: 'idea',
            lineWrapping: false,
        };
        const functionEditorView = (
            <ReactCodeMirror 
                value={this.getValue()}
                options={options} 
                ref={this.editorRef}
                className={this.state.open ? styles.open : styles.closed } />
        );

        return (
            <div data-name={this.props.cell.name}>
                <button onClick={this.onClick} className={styles.toggle}>
                    <FontAwesomeIcon icon={this.state.open ? faCaretUp : faCaretRight} />
                </button>
                { functionEditorView } 
            </div>
        )
    }
});

export default RFunction;