import * as React from 'react';
import {IWorkbenchView} from '../../store';
import {WorkbenchRankingView} from './WorkbenchRankingView';
import {WorkbenchVisView} from './WorkbenchVisView';

export interface IWorkbenchSingleViewProps {
    workbenchIndex: number;
    view: IWorkbenchView;
}

export function WorkbenchSingleView({
    workbenchIndex,
    view
}: IWorkbenchSingleViewProps) {
    return (
        <>
            {view.viewType === 'Ranking' ?
                <WorkbenchRankingView workbenchIndex={workbenchIndex} view={view}/>
                : <WorkbenchVisView workbenchIndex={workbenchIndex} view={view}/>
            }
        </>
    );
}
