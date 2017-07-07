/**
 * Created by sam on 13.02.2017.
 */
import {IColumnDesc, createSelectionDesc} from 'lineupjs/src/model';
import LineUp from 'lineupjs/src/lineup';
import {extent} from 'd3';
import {IAnyVector} from 'phovea_core/src/vector';
import {VALUE_TYPE_STRING, VALUE_TYPE_CATEGORICAL, VALUE_TYPE_REAL, VALUE_TYPE_INT} from 'phovea_core/src/datatype';

export interface IAdditionalColumnDesc extends IColumnDesc {
  selectedId: number;
  selectedOptions?: any;
}

export function numberCol(col: string, rows: any[], label = col, visible = true, width = -1, selectedId = -1, selectionOptions?: string) {
  return {
    type: 'number',
    column: col,
    label,
    domain: extent(rows, (d) => d[col]),
    color: '',
    visible,
    width,
    selectedId,
    selectionOptions
  };
}

export function numberCol2(col: string, min: number, max: number, label = col, visible = true, width = -1, selectedId = -1, selectionOptions?: string) {
  return {
    type: 'number',
    column: col,
    label,
    domain: [min, max],
    color: '',
    visible,
    width,
    selectedId,
    selectionOptions
  };
}

export function categoricalCol(col: string, categories: (string|{label?: string, name: string, color?: string})[], label = col, visible = true, width = -1, selectedId = -1, selectionOptions?: string) {
  return {
    type: 'categorical',
    column: col,
    label,
    categories,
    color: '',
    visible,
    width,
    selectedId,
    selectionOptions
  };
}

export function stringCol(col: string, label = col, visible = true, width = -1, selectedId = -1, selectionOptions: string = undefined) {
  return {
    type: 'string',
    column: col,
    label,
    color: '',
    visible,
    width,
    selectedId,
    selectionOptions
  };
}

export function booleanCol(col: string, label = col, visible = true, width = -1, selectedId = -1, selectionOptions?: string) {
  return {
    type: 'boolean',
    column: col,
    label,
    color: '',
    visible,
    width,
    selectedId,
    selectionOptions
  };
}


export function deriveCol(col: IAnyVector): IColumnDesc {
  const r: any = {
    column: col.desc.name
  };
  const desc = <any>col.desc;
  if (desc.color) {
    r.color = desc.color;
  } else if (desc.cssClass) {
    r.cssClass = desc.cssClass;
  }
  const val = desc.value;
  switch (val.type) {
    case VALUE_TYPE_STRING:
      r.type = 'string';
      break;
    case VALUE_TYPE_CATEGORICAL:
      r.type = 'categorical';
      r.categories = desc.categories;
      break;
    case VALUE_TYPE_REAL:
    case VALUE_TYPE_INT:
      r.type = 'number';
      r.domain = val.range;
      break;
    default:
      r.type = 'string';
      break;
  }
  return r;
}

export function useDefaultLayout(instance: LineUp) {
  instance.data.deriveDefault();
  //insert selection column
  instance.data.insert(instance.data.getRankings()[0], 1, createSelectionDesc());
}
