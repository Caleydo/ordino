import React from 'react';
import { EDragTypes } from './utils';
import { useDrag } from 'react-dnd';
import {addView, IWorkbenchView, useAppDispatch, useAppSelector} from '../..';
import {findViewIndex} from '../../store/storeUtils';

export interface IWorkbenchSingleViewProps {
    view: IWorkbenchView;
}

export function MoveButton({
    view
}: IWorkbenchSingleViewProps) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);

    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.MOVE,
        item: {type: EDragTypes.MOVE, viewId: view.id, index: findViewIndex(view.uniqueId, ordino.workbenches[ordino.focusViewIndex])},
    }), [view.id, ordino.workbenches[ordino.focusViewIndex].views]);

    return (
        <button ref={drag} type="button" className="position-absolute btn btn-primary">Move View</button>
    );
}
