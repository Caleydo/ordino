import * as React from 'react';
import SplitPane from 'react-split-pane';
import { useAppDispatch, useAppSelector } from '../..';
import { EViewDirections } from '../../store';
import { WorkbenchSingleView } from './WorkbenchSingleView';
export function WorkbenchViews({ currentView }) {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    if (currentView.children.length === 0) {
        return React.createElement(WorkbenchSingleView, { view: currentView });
    }
    const northViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.N);
    const southViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.S);
    const eastViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.E);
    const westViews = currentView.children.filter((c) => c.directionFromParent === EViewDirections.W);
    const horizontalPane = (React.createElement(SplitPane, { split: "horizontal", className: "", minSize: 300 },
        currentView.children.filter((c) => c.directionFromParent === EViewDirections.N).map((c) => {
            return (React.createElement(WorkbenchViews, { key: `view ${c.id}`, currentView: c }));
        }),
        React.createElement(WorkbenchSingleView, { view: currentView }),
        currentView.children.filter((c) => c.directionFromParent === EViewDirections.S).map((c) => {
            return (React.createElement(WorkbenchViews, { key: `view ${c.id}`, currentView: c }));
        })));
    const verticalPane = (React.createElement(SplitPane, { split: "vertical", className: "", minSize: 300 },
        westViews.length > 0 ? westViews.map((c) => {
            return (React.createElement(WorkbenchViews, { key: `view ${c.id}`, currentView: c }));
        }) : null,
        northViews.length + southViews.length > 0 ? horizontalPane : React.createElement(WorkbenchSingleView, { view: currentView }),
        eastViews.length > 0 ? eastViews.map((c) => {
            console.log(c);
            return (React.createElement(WorkbenchViews, { key: `view ${c.id}`, currentView: c }));
        }) : null));
    return (React.createElement(React.Fragment, null, currentView.children.length === 0 ? React.createElement(WorkbenchSingleView, { view: currentView }) : eastViews.length + westViews.length > 0 ? verticalPane : horizontalPane));
}
//# sourceMappingURL=WorkbenchViews.js.map