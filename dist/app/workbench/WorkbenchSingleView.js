import * as React from 'react';
import { WorkbenchRankingView } from './WorkbenchRankingView';
import { WorkbenchVisView } from './WorkbenchVisView';
export function WorkbenchSingleView({ workbenchIndex, view }) {
    return (React.createElement(React.Fragment, null, view.viewType === 'Ranking' ?
        React.createElement(WorkbenchRankingView, { workbenchIndex: workbenchIndex, view: view })
        : React.createElement(WorkbenchVisView, { workbenchIndex: workbenchIndex, view: view })));
}
//# sourceMappingURL=WorkbenchSingleView.js.map