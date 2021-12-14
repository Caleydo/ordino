import * as React from 'react';
import { WorkbenchRankingView } from './WorkbenchRankingView';
import { WorkbenchVisView } from './WorkbenchVisView';
export function WorkbenchSingleView({ view }) {
    return (React.createElement(React.Fragment, null, view.viewType === 'Ranking' ?
        React.createElement(WorkbenchRankingView, { view: view })
        : React.createElement(WorkbenchVisView, { view: view })));
}
//# sourceMappingURL=WorkbenchSingleView.js.map