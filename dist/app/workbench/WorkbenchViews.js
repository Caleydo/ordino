import * as React from 'react';
import SplitPane from 'react-split-pane';
import { useAppDispatch, useAppSelector } from '../..';
import { EViewDirections } from '../../store';
import { WorkbenchSingleView } from './WorkbenchSingleView';
export function WorkbenchViews({ currentView }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    console.log(currentView);
    console.log(ordino.workbenches[0]);
    const northViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.N);
    const southViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.S);
    const eastViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.E);
    const westViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.W);
    const horizontalPane = (React.createElement(SplitPane, { split: "horizontal", className: "", size: '50%' },
        northViews.map((c) => React.createElement(WorkbenchViews, { key: `view ${c.id}`, currentView: c })),
        React.createElement(WorkbenchSingleView, { view: currentView }),
        southViews.map((c) => React.createElement(WorkbenchViews, { key: `view ${c.id}`, currentView: c }))));
    const verticalPane = (React.createElement(SplitPane, { split: "vertical", className: "", size: '50%' },
        westViews.map((c) => React.createElement(WorkbenchViews, { key: `view ${c.id}`, currentView: c })),
        northViews.length + southViews.length > 0 ? horizontalPane : React.createElement(WorkbenchSingleView, { view: currentView }),
        eastViews.map((c) => React.createElement(WorkbenchViews, { key: `view ${c.id}`, currentView: c }))));
    return (React.createElement(React.Fragment, null, currentView.children.length === 0 ? React.createElement(WorkbenchSingleView, { view: currentView }) : eastViews.length + westViews.length > 0 ? verticalPane : horizontalPane));
}
//# sourceMappingURL=WorkbenchViews.js.map