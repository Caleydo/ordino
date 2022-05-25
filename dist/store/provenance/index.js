import { initProvenance, createAction } from '@visdesignlab/trrack';
import { trrackInstance } from '../../app';
import React, { createContext, useContext } from 'react';
export function initializeTrrack({ initialState, setter }) {
    const trrack = initProvenance({ state: initialState });
    if (setter) {
        trrack.addGlobalObserver(() => {
            setter(JSON.parse(JSON.stringify(trrack.state.state)));
        });
    }
    trrack.done();
    return trrack;
}
export const TRRACK_ACTION = 'TRRACK';
export const trrackAction = createAction((trrack_state, new_state) => {
    trrack_state.state = new_state;
})
    .setLabel('Setting trrack state from dispatch')
    .saveStateMode('Complete');
export function trrackable(reducer) {
    return function (state, action) {
        switch (action.type) {
            case TRRACK_ACTION:
                return reducer(action.payload, action);
            default:
                return reducer(state, action);
        }
    };
}
export function setReduxFromTrrackAction(payload) {
    return {
        type: TRRACK_ACTION,
        payload,
    };
}
export const trrackMiddleware = (store) => (next) => (action) => {
    if (trrackInstance && action.type.includes('ordino')) {
        next(action);
        const state = store.getState().ordino;
        trrackInstance.trrack.apply(trrackAction.setLabel(action.type)(state));
    }
    else {
        next(action);
    }
};
export const TrrackContext = createContext(undefined);
export function useTrrack() {
    return useContext(TrrackContext);
}
export const TrrackProvider = ({ value, children }) => React.createElement(TrrackContext.Provider, { value: value }, children);
//# sourceMappingURL=index.js.map