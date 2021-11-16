import * as React from 'react';
import { useDrop } from 'react-dnd';
import SplitPane, { Pane} from 'react-split-pane';
import {addView, useAppDispatch, useAppSelector} from '../..';
import {EViewDirections, IWorkbenchView} from '../../store';

import {Lineup} from '../lite';
import {DropOverlay} from './DropOverlay';
import {EDragTypes} from './utils';
import {WorkbenchSingleView} from './WorkbenchSingleView';

export interface IWorkbenchViewsProps {
    currentView: IWorkbenchView;
}

export function WorkbenchViews({
    currentView
}: IWorkbenchViewsProps) {

    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);

    console.log(currentView);
    console.log(ordino.workbenches[0]);

    const northViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.N);
    const southViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.S);
    const eastViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.E);
    const westViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.W);

    const horizontalPane = (
            <SplitPane split="horizontal" className = "" size={'50%'}>

                {northViews.map((c) => <WorkbenchViews key={`view ${c.id}`} currentView={c}/>)}

                <WorkbenchSingleView view={currentView}/>

                {southViews.map((c) => <WorkbenchViews key={`view ${c.id}`} currentView={c}/>)}

            </SplitPane>
    );

    const verticalPane = (
            <SplitPane split="vertical" className = "" size={'50%'}>

                {westViews.map((c) => <WorkbenchViews key={`view ${c.id}`} currentView={c}/>)}

                {northViews.length + southViews.length > 0 ? horizontalPane : <WorkbenchSingleView view={currentView}/>}

                {eastViews.map((c) => <WorkbenchViews key={`view ${c.id}`} currentView={c}/>)}

            </SplitPane>
    );

    return (
        <>
            {currentView.children.length === 0 ? <WorkbenchSingleView view={currentView}/> : eastViews.length + westViews.length > 0 ? verticalPane : horizontalPane}
        </>
    );
}
