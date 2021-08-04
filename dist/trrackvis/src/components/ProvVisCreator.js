import { configure } from 'mobx';
import React from 'react';
import ReactDOM from 'react-dom';
import ProvVis from './ProvVis';
import UndoRedoButton from './UndoRedoButton';
configure({ isolateGlobalState: true });
export function ProvVisCreator(node, prov, callback, buttons = true, ephemeralUndo = false, fauxRoot = prov.graph.root, config = {}) {
    prov.addGlobalObserver(() => {
        ReactDOM.render(React.createElement(ProvVis, Object.assign({}, config, { root: fauxRoot, changeCurrent: callback, current: prov.graph.current, prov: prov, undoRedoButtons: true, ephemeralUndo: ephemeralUndo })), node);
    });
    ReactDOM.render(React.createElement(ProvVis, Object.assign({}, config, { root: fauxRoot, changeCurrent: callback, current: prov.graph.current, prov: prov, undoRedoButtons: true, ephemeralUndo: ephemeralUndo })), node);
}
export function UndoRedoButtonCreator(node, graph, undoCallback, redoCallback) {
    ReactDOM.render(React.createElement(UndoRedoButton, { graph: graph, undoCallback: undoCallback, redoCallback: redoCallback }), node);
}
//# sourceMappingURL=ProvVisCreator.js.map