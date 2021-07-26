import { initProvenance, createAction, ProvenanceGraph, Provenance } from "@visdesignlab/trrack";
import { ViewWrapper } from "./ViewWrapper";
import {IDType} from 'phovea_core';
import { Range } from "phovea_core";

export type DemoState = {
  viewList: View[];
  focusView: number;
};

type View = {
  //this is awful, shouldnt be needed once this is a react component. 
  id: string,
}

export type OrdinoEvents = "Create View" | "Remove View" | "Change View" | "Change Focus View";

const initialState: DemoState = {
  viewList: [],
  focusView: 0
};

const createViewAction = createAction<DemoState, [string], OrdinoEvents>(
  (state: DemoState, id: string) => {
    console.log("in create action")
    state.viewList.push({
      id: id
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

const changeViewAction = createAction<
  DemoState,
  [string, number],
  OrdinoEvents
>((state: DemoState, id: string, newIndex: number) => {
  console.log("in change action");
  state.viewList.splice(newIndex);
  state.viewList.push({
    id: id,
  });
  state.focusView = state.viewList.length - 1;
}).setEventType("Change View");

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
  changeViewAction, 
  focusViewAction
};

export const prov: Provenance<DemoState, any, OrdinoEvents> = initProvenance<DemoState, any, OrdinoEvents>(initialState, {
  loadFromUrl: false,
});
