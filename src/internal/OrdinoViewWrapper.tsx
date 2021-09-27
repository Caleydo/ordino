import {GlobalEventHandler, IDType, PluginRegistry, ProvenanceGraph, Range} from 'phovea_core';
import React, {ReactNode} from 'react';
import {AView, EXTENSION_POINT_TDP_VIEW, FindViewUtils, ISelection, IViewPluginDesc, ViewWrapper} from 'tdp_core';
import {useAsync} from '../hooks';
import {TreeRenderer, ITreeElement, viewPluginDescToTreeElementHelper} from 'tdp_ui';
import {Chooser} from './Chooser';


interface IOrdinoViewWrapperProps {
    graph: ProvenanceGraph;
    wrapper: ViewWrapper;
    // onCreated: () => void;
    onSelectionChanged: (viewWrapper: ViewWrapper, oldSelection: ISelection, newSelection: ISelection, options?: any) => void;
    // onReplaceView?: (view: IViewPluginDesc) => void;
    // onRemoveView?: (view: IViewPluginDesc) => void;
    // onModeChanged?: (view: IViewPluginDesc) => void;
    children?: ReactNode;
}

export function OrdinoViewWrapper({
    graph,
    wrapper,
    children,
    onSelectionChanged
}: IOrdinoViewWrapperProps) {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        wrapper.getInstance().on(AView.EVENT_ITEM_SELECT, (_, oldSelection: ISelection, newSelection: ISelection) => {

            // TODO: wrapper has not changed yet ignore itemSelection
            if (!(oldSelection.range.isNone && newSelection.range.isNone)) {

                onSelectionChanged(wrapper, oldSelection, newSelection);
            }


        });
        return () => {
            wrapper.getInstance().off(AView.EVENT_ITEM_SELECT, () => null);FormElementTyp
        }
    }, [wrapper]);


    React.useEffect(() => {
        ref.current.appendChild(wrapper.node);
    }, [wrapper]);

    return <div className="viewWrapper" ref={ref}>
        {children && <div>
            {children}
        </div>}

    </div>
        ;
}
