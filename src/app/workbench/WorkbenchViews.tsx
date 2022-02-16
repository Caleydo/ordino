import * as React from 'react';
import {useMemo} from 'react';
import SplitPane from 'react-split-pane';
import {useAppDispatch, useAppSelector} from '../..';
import {AddWorkbenchSidebar} from './sidebar/AddWorkbenchSidebar';
import {DetailsSidebar} from './sidebar/DetailsSidebar';
import {WorkbenchSingleView} from './WorkbenchSingleView';

export interface IWorkbenchViewsProps {
    index: number;
    onlyRanking?: boolean;
}

export function WorkbenchViews({
    index,
    onlyRanking = false,
}: IWorkbenchViewsProps) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();

    const views = ordino.workbenches[index].views;

    let wb = null;

    //TODO:: Figure out better way to not force a remount of the individual views because of reparenting here. Currently the empty split panes are doing that.
    if(views.length === 1 || onlyRanking) {
        wb = (
            <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'} primary="second" className = "" minSize={300} size={'0%'}>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'0%'}>
                    <WorkbenchSingleView key={`wbView${views[0].uniqueId}`} workbenchIndex={index} view={views[0]}/>
                </SplitPane>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'0%'}>
                </SplitPane>
            </SplitPane>
        );
    } else if(views.length === 2) {
        wb = (
            <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'} primary="second" className = "" minSize={300} size={'50%'}>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'0%'}>
                    <WorkbenchSingleView key={`wbView${views[0].uniqueId}`} workbenchIndex={index} view={views[0]}/>
                </SplitPane>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'0%'}>
                    <WorkbenchSingleView key={`wbView${views[1].uniqueId}`} workbenchIndex={index} view={views[1]}/>
                </SplitPane>
            </SplitPane>
        );
    } else if(views.length === 3) {
        wb = (
            <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'} primary="second" className = "" minSize={300} size={'50%'}>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'0%'}>
                    <WorkbenchSingleView key={`wbView${views[0].uniqueId}`} workbenchIndex={index} view={views[0]}/>
                </SplitPane>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'50%'}>
                    <WorkbenchSingleView key={`wbView${views[1].uniqueId}`} workbenchIndex={index} view={views[1]}/>
                    <WorkbenchSingleView key={`wbView${views[2].uniqueId}`} workbenchIndex={index} view={views[2]}/>
                </SplitPane>
            </SplitPane>
        );
    } else {
        wb = (
            <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'} primary="second" className = "" minSize={300} size={'50%'}>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'50%'}>
                    <WorkbenchSingleView key={`wbView${views[0].uniqueId}`} workbenchIndex={index} view={views[0]}/>
                    <WorkbenchSingleView key={`wbView${views[3].uniqueId}`} workbenchIndex={index} view={views[3]}/>
                </SplitPane>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'50%'}>
                    <WorkbenchSingleView key={`wbView${views[1].uniqueId}`} workbenchIndex={index} view={views[1]}/>
                    <WorkbenchSingleView key={`wbView${views[2].uniqueId}`} workbenchIndex={index} view={views[2]}/>
                </SplitPane>
            </SplitPane>
        );
    }

    console.log(ordino.workbenches[index].addWorkbenchOpen);

    return (
        <div className="position-relative workbenchWrapper d-flex flex-grow-1">
            <div className="d-flex flex-col w-100">
                {ordino.workbenches[index].detailsOpen ?
                <div style={{flexGrow: 1}}>
                    <DetailsSidebar workbench={ordino.workbenches[index]}/>
                </div> : null}
                <div style={{flexGrow: 15}}>
                    {wb}
                </div>
                {ordino.workbenches[index].addWorkbenchOpen ?
                <div style={{flexGrow: 1}}>
                    <AddWorkbenchSidebar workbench={ordino.workbenches[index]}/>
                </div> : null}

            </div>
        </div>
    );
}
