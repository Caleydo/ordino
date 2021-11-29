import React from 'react';
import { EDragTypes } from './utils';
import { useDrag } from 'react-dnd';
import {addView, EViewDirections, useAppDispatch, useAppSelector} from '../..';
import {setWorkbenchDirection} from '../../store';

export function AddButton() {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);

    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.ADD,
        item: {type: EDragTypes.ADD},

    }));

    return (
        <>
            <button style={{height: '25px'}} onClick={() => {
                dispatch(addView({
                    workbenchIndex: ordino.focusViewIndex,
                    view: {
                        id: (Math.random() + 1).toString(36).substring(7),
                        index: ordino.workbenches[ordino.focusViewIndex].views.length,
                        name: 'Start view',
                        selection: 'multiple',
                        selections: [],
                        group: {
                            name: 'General',
                            order: 10
                        }
                    }
                }));
            }}type="button" className="btn btn-outline-light">Add View</button>

            <button style={{height: '25px'}} onClick={() => {
                dispatch(setWorkbenchDirection({workbenchIndex: ordino.focusViewIndex, direction: ordino.workbenches[ordino.focusViewIndex].viewDirection === 'horizontal' ? 'vertical' : 'horizontal'}));
            }}type="button" className="btn btn-outline-light">Direction</button>
        </>
    );
}
