import * as React from 'react';
import { useDrop } from 'react-dnd';
import SplitPane from 'react-split-pane';
import {addView, useAppDispatch, useAppSelector} from '../..';
import {EViewDirections, IWorkbenchView} from '../../store';

import {Lineup} from '../lite';
import {DropOverlay} from './DropOverlay';
import {EDragTypes} from './utils';
import {WorkbenchSingleView} from './WorkbenchSingleView';

export interface IWorkbenchViewsProps {
    index: number;
}

export function WorkbenchViews({
    index
}: IWorkbenchViewsProps) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);

    const views = ordino.workbenches[index].views;

    console.log(views);

    let wb = null;

    if(views.length === 1) {
        wb = (<WorkbenchSingleView view={views[0]}/>);
    } else if(views.length === 2) {
        wb = (
            <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'} primary="second" className = "" minSize={300} size={'50%'}>
                <WorkbenchSingleView view={views[0]}/>
                <WorkbenchSingleView view={views[1]}/>
            </SplitPane>
        );
    } else if(views.length === 3) {
        wb = (
            <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'} primary="second" className = "" minSize={300} size={'50%'}>
                <WorkbenchSingleView view={views[0]}/>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'50%'}>
                    <WorkbenchSingleView view={views[1]}/>
                    <WorkbenchSingleView view={views[2]}/>
                </SplitPane>
            </SplitPane>
        );
    } else {
        wb = (
            <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'} primary="second" className = "" minSize={300} size={'50%'}>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'50%'}>
                    <WorkbenchSingleView view={views[0]}/>
                    <WorkbenchSingleView view={views[3]}/>
                </SplitPane>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'50%'}>
                    <WorkbenchSingleView view={views[1]}/>
                    <WorkbenchSingleView view={views[2]}/>
                </SplitPane>
            </SplitPane>
        );
    }

    return (
        <div className="position-relative workbenchWrapper d-flex flex-grow-1">
            {wb}
        </div>
    );
}
