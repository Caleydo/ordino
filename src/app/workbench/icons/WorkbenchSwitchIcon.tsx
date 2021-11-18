import * as React from 'react';
import {useDrop} from 'react-dnd';
import {addView, EViewDirections, IWorkbenchView, switchViews, useAppDispatch, useAppSelector} from '../../..';
import {EDragTypes} from '../utils';

export interface IWorkbenchIconProps {
    view: IWorkbenchView;
}

export function WorkbenchSwitchIcon({
    view
}: IWorkbenchIconProps) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: [EDragTypes.MOVE],
        drop: (d: {type: EDragTypes, viewId: number, index: number}) => {
            console.log(d, view);
            dispatch(switchViews({workbenchIndex: ordino.focusViewIndex, firstViewIndex: d.index, secondViewIndex: view.index}));
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [view.index]);

    return (
        <div ref={drop} className={`position-absolute d-flex align-items-center justify-content-center`} style={{
            height: '100%',
            width: '100%',
            zIndex: 10,
        }}>
            <div className="text-center">
                <i className="fas fa-exchange-alt display-1 opacity-100" style={{color: 'black'}}></i>
            </div>
        </div>
    );
}
