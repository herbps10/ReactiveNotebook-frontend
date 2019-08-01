import { observable, decorate } from 'mobx';
import Cell from './Cell.js';

class CellStore {
    cells = [];
    helpTopic = "";

    constructor(webSocketService) {
        this.webSocketService = webSocketService;
        this.webSocketService.addReceiveListener(this.handleMessage.bind(this));
    }

    move(source, destination) {
        if (source == destination) return;

        const payload = {
            type: 'move',
            source: this.cells[source].position,
            destination: source > destination ? destination + 0.5 : destination + 1.5
        };

        this.cells.splice(destination, 0, this.cells.splice(source, 1)[0]);
        this.cells.forEach((cell, index) => cell.position = index + 1)

        this.webSocketService.sendMessage(JSON.stringify(payload));
    }

    addCell(cell) {
        if (cell.position === undefined) {
            if (this.cells.length === 0) {
                cell.position = 1;
            }
            else {
                cell.position = this.cells[0].position + 1;
            }
        }
        this.cells.push(cell);
    }

    addCellBefore(cell, newCell) {
        const index = this.cells.indexOf(cell);
        this.cells.splice(index, 0, newCell);
        this.cells.forEach((cell, index) => cell.position = index + 1)
    }

    addCellAfter(cell, newCell) {
        const index = this.cells.indexOf(cell);
        this.cells.splice(index + 1, 0, newCell);
        this.cells.forEach((cell, index) => cell.position = index + 1)
    }

    deleteCell(cell) {
        this.cells = this.cells.filter(function (d) { return d !== cell; });
        this.cells.forEach((cell, index) => cell.position = index + 1)
        const payload = {
            type: 'delete',
            cell: cell
        }

        this.webSocketService.sendMessage(JSON.stringify(payload));
    }

    runCell(cell) {
        if (cell.value === "") {
            this.deleteCell(cell);
            return;
        }
        else if(cell.value.startsWith("?")) {
            this.helpTopic = cell.value.replace(/^\?/, "")
        }
        const payload = {
            type: 'update',
            cell: cell
        }
        this.webSocketService.sendMessage(JSON.stringify(payload));
        cell.loading = true;
    }

    updateView(cell, value) {
        const payload = {
            type: 'updateView',
            cell: cell,
            value: value
        };
        this.webSocketService.sendMessage(JSON.stringify(payload));
    }

    updateSize(cell, value) {
        const payload = {
            type: 'updateSize',
            cell: cell,
            value: value
        };
        this.webSocketService.sendMessage(JSON.stringify(payload));
    }

    updateOpen(cell, value) {
        const payload = {
            type: 'updateOpen',
            cell: cell,
            value: value
        };
        this.webSocketService.sendMessage(JSON.stringify(payload));
    }

    handleMessage(data) {
        const changeset = JSON.parse(data.data);

        // If the cells property is defined, then it means the server
        // is sending cells in bulk to initialize the notebook
        if (changeset.cells !== undefined) {
            const cells = Object.values(changeset.cells);
            this.cells = [];
            for (let i = 0; i < cells.length; i++) {
                const change = cells[i];

                const cell = new Cell(change.value[0], "");
                cell.id             = change.id[0];
                cell.RClass         = change.RClass;
                cell.name           = change.name[0];
                cell.result         = change.result;
                cell.hasImage       = change.hasImage[0];
                cell.position       = change.position[0];
                cell.open           = change.open[0];
                if(change.viewWidth.length > 0)
                    cell.viewWidth  = change.viewWidth[0];
                if(change.viewHeight.length > 0)
                    cell.viewHeight = change.viewHeight[0];

                this.addCell(cell);
            }

            // If the cell set is empty, add a default cell
            if (cells.length === 0) {
                const defaultCell = new Cell("", "");
                defaultCell.open = true; // Have the editor show the cell in active state
                defaultCell.defaultCell = true;
                this.addCell(defaultCell);
            }
        }
        else {
            // Handle a changeset that includes an error
            if (changeset.error !== undefined) {
                const cell = this.cells.filter(function (d) {
                    return d.id === changeset.id[0];
                });

                cell[0].loading = false;
                cell[0].error = changeset.error;
                cell[0].result = [""];
                cell[0].RClass = [];
                cell[0].lastUpdate = new Date().getTime();
                cell[0].hasImage = false;
            }
            // Handle a normal changeset
            else {
                for (let i = 0; i < changeset.length; i++) {
                    const change = changeset[i];

                    const cell = this.cells.filter(function (d) {
                        return d.id === change.id[0];
                    });

                    if (change !== undefined) {
                        cell[0].loading = false;
                        cell[0].result      = change.result;
                        cell[0].lastUpdate  = new Date().getTime();
                        cell[0].hasImage    = change.hasImage[0];
                        cell[0].RClass      = change.RClass;
                        cell[0].name        = change.name[0];
                        cell[0].error       = "";
                        cell[0].position    = change.position[0];
                        cell[0].open        = change.open[0];
                        if(change.viewWidth.length > 0) 
                            cell.viewWidth  = change.viewWidth[0];
                        if(change.viewHeight.length > 0)
                            cell.viewHeight = change.viewHeight[0];
                    }
                }
            }
        }

    }
}

decorate(CellStore, { cells: observable, helpTopic: observable });

export default CellStore;
