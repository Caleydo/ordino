import * as React from 'react';
import { Vis } from 'tdp_core';
import { useAppSelector } from '../..';
import { EColumnTypes } from '../../../../tdp_core/dist/vis/interfaces';
export function WorkbenchVisView({ view }) {
    const ordino = useAppSelector((state) => state.ordino);
    const data = Object.values(ordino.workbenches[ordino.focusViewIndex].data);
    const colDescriptions = ordino.workbenches[ordino.focusViewIndex].columnDescs;
    console.log(data);
    const cols = [];
    for (const c of colDescriptions.filter((d) => d.type === 'number' || d.type === 'categorical')) {
        cols.push({
            info: {
                name: c.label,
                description: c.summary,
                id: c.label + (c)._id
            },
            values: data.map((d, i) => {
                return { id: d._id, val: d[(c).column] ? d[(c).column] : c.type === 'number' ? null : '--' };
            }),
            type: c.type === 'number' ? EColumnTypes.NUMERICAL : EColumnTypes.CATEGORICAL
        });
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" },
            React.createElement("div", { className: "view-actions" },
                React.createElement("button", { type: "button", className: "btn-close" })),
            React.createElement("div", { className: "view-parameters" }),
            React.createElement(Vis, { columns: cols }))));
}
//# sourceMappingURL=WorkbenchVisView.js.map