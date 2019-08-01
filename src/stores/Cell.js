import {observable, decorate} from 'mobx';
const uuidv1 = require("uuid/v1");

class Cell {
    value = "";
    result = "";
    error = "";
    RClass = [];
    name = "";
    hasImage = false;
    position = 1;
    viewWidth = null;
    viewHeight = null;
    open = false;
    defaultCell = false;
    loading = false;
    constructor(value, result) {
        this.id = uuidv1();
        this.value = value;
        this.result = result;
        this.position = 1;
        this.lastUpdate = new Date().getTime();
    }

    resultString() {
        return (typeof this.result == "string") ? this.result : this.result.join("\n");
    }
}

decorate(Cell, {
    value: observable,
    result: observable,
    name: observable,
    lastUpdate: observable,
    hasImage: observable,
    error: observable,
    RClass: observable,
    loading: observable,
    open: observable
})

export default Cell;
