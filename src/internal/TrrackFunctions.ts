import { initProvenance, createAction, ProvenanceGraph, Provenance } from "../trrack/src/index";
import { ViewWrapper } from "./ViewWrapper";
import {IDType} from 'phovea_core';
import { Range } from "phovea_core";

export type DemoState = {
  viewList: View[];
  focusView: number;
};

type View = {
  viewId: string;
  idType: string;
  selection: string;
  options: any;
  rankings: Ranking[]
};

export type Ranking = {
  sort: Sort;
  group: Group;
  columns: Column[];
};

export type Sort = {
  rid: number;
  columns: { asc: boolean; col: string }[];
  isSingleSort: boolean;
};

export type Group = {
  rid: number;
  columns: string[];
};

export type Column = {
  id: string;
  filter: Filter;
  metadata: Metadata;
};

export type Metadata = {
  rid: number;
  col: string;
  label: string;
  summary: string;
  description: string;
};

export type Filter = {
  rid: number;
  col: string;
  value: string | string[] | null;
  isRegExp: boolean;
  filterMissing: boolean;
};

export type OrdinoEvents = "Create View" | "Remove View" | "Replace View" | "Change Focus View" | "Select Focus" | "Select Secondary" | "Sort View" | "Group View" | "Filter Column";

const initialState: DemoState = {
  viewList: [],
  focusView: 0
};

const createViewAction = createAction<DemoState, [string, string, string, any], OrdinoEvents>(
  (state: DemoState, id: string, idType: string, selection: string,  options: any) => {
    state.viewList.push({
      viewId: id,
      idType: idType,
      selection: selection,
      options: options,
      rankings: [
        {
          sort: {
            isSingleSort: true,
            rid: 0,
            columns: [],
          },
          group: {
            rid: 0,
            columns: [],
          },
          columns: [],
        },
      ],
    });
    state.focusView = state.viewList.length - 1;
  }
)
.setEventType("Create View");

const sortAction = createAction<DemoState, [number, { asc: boolean; col: string }[], boolean, number], OrdinoEvents>(
  (state: DemoState, rid: number, columns: { asc: boolean; col: string }[], isSingleSort: boolean, index: number) => {
    state.viewList[index].rankings[rid].sort = {
      isSingleSort: isSingleSort,
      rid: rid,
      columns: columns
    }
  }
).setEventType("Sort View");

const groupAction = createAction<DemoState, [number, string[], number], OrdinoEvents>(
  (state: DemoState, rid: number, columns: string[], index: number) => {
    state.viewList[index].rankings[rid].group = {
      rid: rid,
      columns: columns
    }
  }
).setEventType("Group View");

const setMetadataAction = createAction<
  DemoState,
  [string, number, string, string, string, number, any | null],
  OrdinoEvents
>((state: DemoState, column: string, rid: number, label: string, summary: string, description: string, index: number, columnInfo: any | null) => {
  console.log(state)
  if(columnInfo)
  {
    state.viewList[index].rankings[rid].columns = columnInfo
  }

  console.log(state);

  state.viewList[index].rankings[rid].columns.filter(c => c.id === column)[0].metadata = {
    rid: rid,
    col: column,
    label: label, 
    summary: summary, 
    description: description
  };
}).setEventType("Group View");

const filterAction = createAction<
  DemoState,
  [string, number, string | string[], boolean, boolean, number],
  OrdinoEvents
>((state: DemoState, column: string, rid: number, value: string | string[], isRegExp: boolean, filterMissing: boolean, index: number) => {
  state.viewList[index].rankings[rid].columns.filter(c => c.id === column)[0].filter = {
    rid: rid,
    col: column,
    value: value,
    isRegExp: isRegExp, 
    filterMissing: filterMissing,
  };
}).setEventType("Filter Column");

const removeViewAction = createAction<DemoState, [number], OrdinoEvents>(
  (state: DemoState, removedIndex: number) => {
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
    state.viewList.splice(newIndex);
    state.viewList.push({
      viewId: id,
      idType: idType,
      selection: selection,
      options: options,
      rankings: [
        {
          sort: {
            isSingleSort: true,
            rid: 0,
            columns: [],
          },
          group: {
            rid: 0,
            columns: [],
          },
          columns: [],
        },
      ],
    });
    state.focusView = state.viewList.length - 1;
  }
).setEventType("Replace View");

const focusViewAction = createAction<DemoState, [number], OrdinoEvents>(
  (state: DemoState, newIndex: number) => {
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
  replaceViewAction,
  sortAction,
  groupAction,
  filterAction,
  setMetadataAction
};

export const prov: Provenance<DemoState, any, OrdinoEvents> = initProvenance<DemoState, any, OrdinoEvents>(initialState, {
  loadFromUrl: false,
});
