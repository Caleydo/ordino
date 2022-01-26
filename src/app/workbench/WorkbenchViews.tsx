import * as React from 'react';
import {useMemo} from 'react';
import SplitPane from 'react-split-pane';
import {useAppSelector} from '../..';
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

    const views = ordino.workbenches[index].views;

    const children = useMemo(() => {
        return views.map((v) => <WorkbenchSingleView workbenchIndex={index} key={v.id} view={v}/>);
    }, [views]);

    let wb = null;

    //TODO:: Figure out better way to not force a remount of the individual views because of reparenting here. Currently the empty split panes are doing that.
    if(views.length === 1) {
        wb = (
            <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'} primary="second" className = "" minSize={300} size={'0%'}>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'0%'}>
                    {[<WorkbenchSingleView key={`${views[0].id}`} workbenchIndex={index} view={views[0]}/>]}
                </SplitPane>
                {/* //@ts-expect-error */}
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'0%'}>
                    {[<></>]}
                </SplitPane>
            </SplitPane>
        );
    } else if(views.length === 2) {
        wb = (
            <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'} primary="second" className = "" minSize={300} size={'50%'}>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'0%'}>
                    <WorkbenchSingleView workbenchIndex={index} view={views[0]}/>
                </SplitPane>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'0%'}>
                    <WorkbenchSingleView workbenchIndex={index} view={views[1]}/>
                </SplitPane>
            </SplitPane>
        );
    } else if(views.length === 3) {
        wb = (
            <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'} primary="second" className = "" minSize={300} size={'50%'}>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'0%'}>
                    <WorkbenchSingleView workbenchIndex={index} view={views[0]}/>
                </SplitPane>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'50%'}>
                    <WorkbenchSingleView workbenchIndex={index} view={views[1]}/>
                    <WorkbenchSingleView workbenchIndex={index} view={views[2]}/>
                </SplitPane>
            </SplitPane>
        );
    } else {
        wb = (
            <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'vertical' : 'horizontal'} primary="second" className = "" minSize={300} size={'50%'}>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'50%'}>
                    <WorkbenchSingleView workbenchIndex={index} view={views[0]}/>
                    <WorkbenchSingleView workbenchIndex={index} view={views[3]}/>
                </SplitPane>
                <SplitPane split={ordino.workbenches[ordino.focusViewIndex].viewDirection === 'vertical' ? 'horizontal' : 'vertical'} primary="second" className = "" minSize={300} size={'50%'}>
                    <WorkbenchSingleView workbenchIndex={index} view={views[1]}/>
                    <WorkbenchSingleView workbenchIndex={index} view={views[2]}/>
                </SplitPane>
            </SplitPane>
        );
    }

    return (
        <div className="position-relative workbenchWrapper d-flex flex-grow-1">
            {onlyRanking ? <WorkbenchSingleView workbenchIndex={index} view={views[0]}/> : wb}
        </div>
    );
}
