import * as React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ReprovisynRestBaseUtils } from 'reprovisyn';
import { IDType, useAsync, Range } from 'tdp_core';
import { useAppDispatch, useAppSelector } from '../..';
import { Ranking } from '../../ranking';
import { removeView } from '../../store';
import { colorPalette } from '../Breadcrumb';
import { DropOverlay } from './DropOverlay';
import { useLoadColumnDesc } from './useLoadColumnDesc';
import { useLoadData } from './useLoadData';
import { useLoadView } from './useLoadView';
import { EDragTypes } from './utils';
export function WorkbenchRankingView({ workbenchIndex, view }) {
    var _a;
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: [EDragTypes.MOVE],
        canDrop: (d) => {
            return d.viewId !== view.id;
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), [view.id]);
    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.MOVE,
        item: { type: EDragTypes.MOVE, viewId: view.id, index: view.index },
    }), [view.id, view.index]);
    const { status, value: plugin } = useLoadView(view.id);
    const loadMetaData = React.useMemo(() => () => {
        if (!(plugin === null || plugin === void 0 ? void 0 : plugin.desc.itemIDType)) {
            return null;
        }
        return ReprovisynRestBaseUtils.getEntityMetadata({ entityId: plugin === null || plugin === void 0 ? void 0 : plugin.desc.itemIDType });
    }, [status]);
    const { status: metadataStatus, value: entityMetadata } = useAsync(loadMetaData, []);
    const { data } = useLoadData((_a = plugin === null || plugin === void 0 ? void 0 : plugin.desc) === null || _a === void 0 ? void 0 : _a.itemIDType, entityMetadata, plugin === null || plugin === void 0 ? void 0 : plugin.desc);
    const { value: columnDesc } = useLoadColumnDesc(plugin === null || plugin === void 0 ? void 0 : plugin.desc.itemIDType, entityMetadata);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { ref: drop, id: view.id, className: "position-relative flex-column shadow bg-body workbenchView rounded flex-grow-1" },
            workbenchIndex === ordino.focusViewIndex ?
                React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "view-actions" },
                        React.createElement("button", { type: "button", onClick: () => dispatch(removeView({ workbenchIndex, viewIndex: view.index })), className: "btn-close" })),
                    React.createElement("div", { ref: drag, className: "view-parameters d-flex" },
                        React.createElement("div", null,
                            React.createElement("button", { type: "button", className: "chevronButton btn btn-outline-primary btn-sm align-middle m-1", style: { color: colorPalette[workbenchIndex], borderColor: colorPalette[workbenchIndex] } },
                                " ",
                                React.createElement("i", { className: "flex-grow-1 fas fa-chevron-right m-1" }),
                                "Edit View")),
                        React.createElement("span", { className: 'view-title row align-items-center m-1' },
                            React.createElement("strong", null, "Ranking")))) :
                React.createElement(React.Fragment, null,
                    React.createElement("div", { ref: drag, className: "view-parameters d-flex" },
                        React.createElement("span", { className: 'view-title row align-items-center m-1' },
                            React.createElement("strong", null, "Ranking")))),
            React.createElement("div", { className: "inner" }, (data === null || data === void 0 ? void 0 : data.length) && columnDesc ?
                React.createElement(Ranking, { data: data, columnDesc: columnDesc, selection: {
                        idtype: new IDType('start', null, null),
                        range: Range.none()
                    }, options: {
                        itemIDType: 'idtype'
                    } })
                : null),
            isOver && canDrop ? React.createElement(DropOverlay, { view: view }) : null)));
}
//# sourceMappingURL=WorkbenchRankingView.js.map