import * as React from 'react';
import {IWorkbenchView} from '../../store';
import {WorkbenchRankingView} from './WorkbenchRankingView';
import {WorkbenchVisView} from './WorkbenchVisView';

export interface IWorkbenchSingleViewProps {
    view: IWorkbenchView;
}

export function WorkbenchSingleView({
    view
}: IWorkbenchSingleViewProps) {
    return (
        <>
            {view.viewType === 'Ranking' ?
                <WorkbenchRankingView view={view}/>
                : <WorkbenchVisView view={view}/>
            }
        </>
    );
}
