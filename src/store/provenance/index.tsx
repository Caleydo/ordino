import { IOrdinoAppState } from '../interfaces';
import { initProvenance, createAction } from '@visdesignlab/trrack';
import { OrdinoReducer, RootState } from '../store';
import { AnyAction, Middleware } from '@reduxjs/toolkit';
import { trrackInstance } from '../../app';
import React, { createContext, FC, useContext } from 'react';

type SetupArgs = {
  initialState: IOrdinoAppState;
  setter?: (state: IOrdinoAppState) => void;
};

type TrrackState = {
  state: IOrdinoAppState;
};

export function initializeTrrack({ initialState, setter }: SetupArgs) {
  const trrack = initProvenance<TrrackState, unknown, unknown>({ state: initialState });

  if (setter) {
    trrack.addGlobalObserver(() => {
      setter(JSON.parse(JSON.stringify(trrack.state.state)));
    });
  }

  trrack.done();

  return trrack;
}

export type Trrack = ReturnType<typeof initializeTrrack>;

export const TRRACK_ACTION = 'TRRACK';

export const trrackAction = createAction<TrrackState, [IOrdinoAppState]>((trrack_state, new_state) => {
  trrack_state.state = new_state;
})
  .setLabel('Setting trrack state from dispatch')
  .saveStateMode('Complete');

export function trrackable(reducer: OrdinoReducer) {
  return function (state: IOrdinoAppState, action: AnyAction) {
    switch (action.type) {
      case TRRACK_ACTION:
        return reducer(action.payload, action);
      default:
        return reducer(state, action);
    }
  };
}

export function setReduxFromTrrackAction(payload: IOrdinoAppState) {
  return {
    type: TRRACK_ACTION,
    payload,
  };
}

export const trrackMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  if (trrackInstance && action.type.includes('ordino')) {
    next(action);
    const state = store.getState().ordino;
    trrackInstance.trrack.apply(trrackAction.setLabel(action.type)(state));
  } else {
    next(action);
  }
};

export const TrrackContext = createContext<Trrack>(undefined!);

export function useTrrack() {
  return useContext(TrrackContext);
}

export const TrrackProvider: FC<{ value: Trrack }> = ({ value, children }) => <TrrackContext.Provider value={value}>{children}</TrrackContext.Provider>;
