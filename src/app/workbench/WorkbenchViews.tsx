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
    currentView: IWorkbenchView;
}

export function WorkbenchViews({
    currentView
}: IWorkbenchViewsProps) {

    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);

    if(currentView.children.length === 0) {
        return <WorkbenchSingleView view={currentView}/>;
    }

    const northViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.N);
    const southViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.S);
    const eastViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.E);
    const westViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.W);

    const horizontalPane = (
            <SplitPane split="horizontal" className = "" minSize={300}>

            {currentView.children.filter((c) => c.directionFromParent === EViewDirections.N).map((c) => {
                return (<WorkbenchViews key={`view ${c.id}`} currentView={c}/>);
            })}

            <WorkbenchSingleView view={currentView}/>

            {currentView.children.filter((c) => c.directionFromParent === EViewDirections.S).map((c) => {
                return (<WorkbenchViews key={`view ${c.id}`} currentView={c}/>);
            })}

            </SplitPane>
    );

    const verticalPane = (
            <SplitPane split="vertical" className = "" minSize={300}>

                {westViews.length > 0 ? westViews.map((c) => {
                    return (<WorkbenchViews key={`view ${c.id}`} currentView={c}/>);
                }) : null}

                {northViews.length + southViews.length > 0 ? horizontalPane : <WorkbenchSingleView view={currentView}/>}

                {eastViews.length > 0 ? eastViews.map((c) => {
                    console.log(c);
                    return (<WorkbenchViews key={`view ${c.id}`} currentView={c}/>);
                }) : null}
            </SplitPane>
    );

    return (
        <>
            {currentView.children.length === 0 ? <WorkbenchSingleView view={currentView}/> : eastViews.length + westViews.length > 0 ? verticalPane : horizontalPane}
        </>
    );
}
