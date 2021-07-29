import { initProvenance, createAction, ProvenanceGraph, Provenance } from "../trrack/src/index";
import { ViewWrapper } from "./ViewWrapper";
import {IDType} from 'phovea_core';
import { Range } from "phovea_core";

export type DemoState = {
  viewList: View[];
  focusView: number;
};

type View = {
  viewId: string,
  idType: string,
  selection: string, 
  options: any, 
}

export type OrdinoEvents = "Create View" | "Remove View" | "Replace View" | "Change Focus View" | "Select Focus" | "Select Secondary";

const initialState: DemoState = {
  viewList: [],
  focusView: 0
};

const createViewAction = createAction<DemoState, [string, string, string, any], OrdinoEvents>(
  (state: DemoState, id: string, idType: string, selection: string,  options: any) => {
    console.log("in create action")
    state.viewList.push({
      viewId: id,
      idType: idType, 
      selection: selection, 
      options: options,
    })
    state.focusView = state.viewList.length - 1;
  }
)
.setEventType("Create View");

const removeViewAction = createAction<DemoState, [number], OrdinoEvents>(
  (state: DemoState, removedIndex: number) => {
    console.log("in remove action")
    state.viewList.splice(removedIndex)
    state.focusView = state.viewList.length - 1;
  }
).setEventType("Remove View");

const selectFocusAction = createAction<DemoState, [string, string], OrdinoEvents>(
  (state: DemoState, idtype: string, range: string) => {
    state.viewList[state.focusView].selection = range;
    state.viewList[state.focusView].idType = idtype;
  }
).setEventType("Select Focus");

const selectSecondaryAction = createAction<DemoState, [string, string], OrdinoEvents>(
  (state: DemoState, idtype: string, range: string) => {
    state.viewList[state.focusView - 1].selection = range;
    state.viewList[state.focusView - 1].idType = idtype;

  }
).setEventType("Select Secondary");

const replaceViewAction = createAction<DemoState, [number, string, string, string, any], OrdinoEvents>(
  (
    state: DemoState,
    newIndex: number,
    id: string,
    idType: string,
    selection: string,
    options: any
  ) => {
    console.log("in change action");
    state.viewList.splice(newIndex);
    state.viewList.push({
      viewId: id,
      idType: idType,
      selection: selection,
      options: options,
    });
    state.focusView = state.viewList.length - 1;
  }
).setEventType("Replace View");

const focusViewAction = createAction<DemoState, [number], OrdinoEvents>(
  (state: DemoState, newIndex: number) => {
    console.log("in focus action")
    state.focusView = newIndex
  }
)
.setEventType("Change Focus View")

export const provenanceActions = {
  createViewAction, 
  removeViewAction, 
  focusViewAction,
  selectFocusAction, 
  selectSecondaryAction,
  replaceViewAction
};

export const prov: Provenance<DemoState, any, OrdinoEvents> = initProvenance<DemoState, any, OrdinoEvents>(initialState, {
  loadFromUrl: false,
});
