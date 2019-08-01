import React from 'react';
import CellList from './components/CellList.js';
import { observer } from 'mobx-react';
import { DragDropContext } from 'react-beautiful-dnd';
import Header from './components/Header.js';
import HelpPane from './components/HelpPane.js';
import './App.css';

const App = observer(class App extends React.Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    if(
      result.source !== null && result.destination !== null &&
      result.source.index !== result.destination.index
    ) {
      this.props.store.move(result.source.index, result.destination.index);
    }
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="App">
          
          <div className="contents">

            <div className='leftpane'>
              <Header connected={this.props.store.webSocketService.connected} />
              <CellList store={this.props.store} className="cellList" />
            </div>

            <HelpPane store={this.props.store} />
          </div>
        </div>
     </DragDropContext>
    );
  }
});

export default App;
