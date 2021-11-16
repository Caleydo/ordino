import * as React from 'react';
import {useDrop} from 'react-dnd';
import {addView, useAppDispatch, useAppSelector} from '../../..';
import {EViewDirections, IWorkbenchView} from '../../../store';
import {EDragTypes} from '../utils';

export interface IWorkbenchIconProps {
    view: IWorkbenchView;
}

export function WorkbenchRightIcon({
    view
}: IWorkbenchIconProps) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: [EDragTypes.ADD, EDragTypes.MOVE],
        drop: (d) => {
            dispatch(addView({
                workbenchIndex: ordino.focusViewIndex,
                view: {
                    id: (Math.random() + 1).toString(36).substring(7),
                    index: 0,
                    name: 'Start view',
                    selection: 'multiple',
                    selections: [],
                    group: {
                        name: 'General',
                        order: 10
                    }
                    }
            }));
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), []);

    return (
        <div ref={drop} className={`position-absolute d-flex align-items-center justify-content-center ${isOver ? 'bg-primary' : ''}`} style={{
            height: '100%',
            width: '33%',
            right: 0,
            zIndex: 10,
        }}>
            <div className="text-center">
                <i className="fas fa-bars display-1 opacity-100" style={{color: 'cornflowerblue'}}></i>
            </div>
        </div>
    );
}
