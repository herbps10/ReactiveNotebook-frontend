import React from 'react';
import styles from './HelpPane.module.css';
import Modal from 'react-modal';

Modal.setAppElement("#root");

class HelpModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false,
            search: ""
        }

        this.inputRef = React.createRef();

        this.hotkeyListener = this.hotkeyListener.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.hotkeyListener);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.hotkeyListener);
    }

    hotkeyListener(e) {
        if(e.ctrlKey && e.key == "?") {
            this.openModal();
            this.inputRef.current.focus();
        }
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    updateSearch(e) {
        this.setState({ search: e.target.value });
    }

    handleSearch() {
        this.props.store.helpTopic = this.state.search;
        this.setState({ search: "" });
        this.closeModal();
    }

    render() {
        return(
            <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} className={styles.modal} overlayClassName={styles.overlay}>
                <form onSubmit={this.handleSearch}>
                    <input type='text' ref={this.inputRef} onChange={this.updateSearch} value={this.state.search}></input>
                </form>
            </Modal>
        );
    }
}

export default HelpModal;