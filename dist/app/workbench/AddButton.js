import React from 'react';
import { EDragTypes } from './utils';
import { useDrag } from 'react-dnd';
import { addView, useAppDispatch, useAppSelector } from '../..';
import { setWorkbenchDirection } from '../../store';
export function AddButton() {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.ADD,
        item: { type: EDragTypes.ADD },
    }));
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { onClick: () => {
                dispatch(addView({
                    workbenchIndex: ordino.focusViewIndex,
                    view: {
                        id: 'reprovisyn_ranking_viralland.public.samples',
                        viewType: 'Ranking',
                        index: ordino.workbenches[ordino.focusViewIndex].views.length,
                        name: 'Gene',
                        selection: 'multiple',
                        selections: [],
                        group: {
                            name: 'General',
                            order: 10
                        }
                    }
                }));
            }, type: "button", className: "btn btn-primary" }, "Add Ranking"),
        React.createElement("button", { onClick: () => {
                dispatch(addView({
                    workbenchIndex: ordino.focusViewIndex,
                    view: {
                        viewType: 'Vis',
                    }
                }));
            }, type: "button", className: "btn btn-primary" }, "Add Vis"),
        React.createElement("button", { onClick: () => {
                dispatch(setWorkbenchDirection({ workbenchIndex: ordino.focusViewIndex, direction: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'horizontal' ? 'vertical' : 'horizontal' }));
            }, type: "button", className: "btn btn-primary" }, "Direction")));
}
//# sourceMappingURL=AddButton.js.map