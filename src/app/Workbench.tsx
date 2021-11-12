import React, {useEffect, useRef, useState} from 'react';
import {useMemo} from 'react';
import {useDrop} from 'react-dnd';
import Split from 'react-split';
// import Split from 'react-split-grid'

import {views} from '../base/constants';
import {useAppDispatch, useAppSelector} from '../hooks';
import { changeFocus, addSelection, IWorkbench, replaceWorkbench, IWorkbenchView} from '../store/ordinoSlice';
import {DetailViewChooser} from './DetailViewChooser';
import {EWorkbenchType} from './Filmstrip';
import {Lineup} from './lite';
import {EDragTypes} from './workbench/utils';
import {WorkbenchSingleView} from './workbench/WorkbenchSingleView';
import {WorkbenchViews} from './workbench/WorkbenchViews';

// tslint:disable-next-line:variable-name
// const GridLayoutWithWitdth = WidthProvider(GridLayout);
// function takeSpace(layout: GridLayout.Layout[]) {
//     const counter = 0;
//     while(true) {
//         layout[counter];
//     }
// }

function findBiggestViewIndex(layout: GridLayout.Layout[], height: number, width: number) {
    let counter = 0;
    for(const j of layout) {
        if(j.h === height || j.w === width) {
            return counter;
        }
        counter += 1;
    }
}

const WORKBENCH_PADDING = 50;

// these props should be made optional
export function Workbench(props: {
    workbench: IWorkbench;
    type: EWorkbenchType;
    style: React.CSSProperties
}) {
    const [embedded, setEmbedded] = React.useState<boolean>(false);
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: EDragTypes.ADD,
        drop: () => {console.log('dropped'); return true;},
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
      }), []);

    // console.log(workbenchWidth, workbenchHeight, workbenchLayout);

    const chooserIsOpenClass = props.type === EWorkbenchType.FOCUS && props.workbench.selections?.length && ordino.workbenches.length - 1 === props.workbench.index ? 'open-chooser' : '';

    const setSelection = React.useMemo(() => (s) => {
        dispatch(addSelection({workbenchIndex: props.workbench.index, viewIndex: 0, newSelection: Object.keys(s.selectedRowIds)}));
    }, []);

    // const children = React.useMemo(() => {
    //     return props.workbench.views.map((d: IWorkbenchView, i) => {
    //         return (
    //             <div key={`randomComp${i}`} className = "shadow p-3 m-3 bg-body workbenchView rounded">
    //                 <Lineup onSelectionChanged={setSelection} />
    //             </div>
    //         );
    //     });
    //   }, [props.workbench.views.length]);

    console.log(ordino.workbenches[0].startingView);


    return (
        <div style={props.style} className={`d-flex align-items-stretch ordino-workbench ${props.type} ${chooserIsOpenClass}`}>
            <>
                {/* {props.workbench.index !== 0 ? (
                    <DetailViewChooser
                        index={props.workbench.index}
                        embedded={embedded}
                        setEmbedded={setEmbedded}
                        views={views}
                        selectedView={props.workbench.views[0] as any}
                        onSelectedView={(view, viewIndex) => {
                            dispatch(
                                replaceWorkbench({
                                    workbenchIndex: props.workbench.index,
                                    newWorkbench:
                                    {
                                        index: 0,
                                        views: [
                                            {
                                                id: view.id,
                                                name: view.name,
                                                index: viewIndex,
                                                selection: [],
                                                filters: []
                                            }
                                        ],
                                        id: view.id,
                                        name: view.name,
                                        selections: [],
                                        filters: []
                                    }
                                })
                            );
                            //this timeout is needed for the animation

                            setTimeout(() => {
                                dispatch(
                                    changeFocus({
                                        index: viewIndex
                                    })
                                );
                            }, 0);
                        }}
                    />
                ) : null} */}
                {/* <GridLayout key={workbenchWidth} className="layout" layout={workbenchLayout} rowHeight={1} cols={workbenchWidth} width={workbenchWidth} margin={[20, 0]} containerPadding={[0, 0]} onLayoutChange={onLayoutChange}>
                    {children}
                </GridLayout> */}
                {/*
                <GridLayout className="layout" layout={layout} cols={4} containerWidth={500}>
                    {props.workbench.views.map((d: IWorkbenchView, i) => {
                        console.log(i)
                        return (
                            <div key={`randomComp${i}`} data-grid={{x: i, y: i, w: 1, h: 1}} className = "shadow p-3 m-3 bg-body workbenchView rounded">
                                <Lineup onSelectionChanged={setSelection} />
                            </div>
                        );
                    })}
                </GridLayout> */}
                <WorkbenchViews currentView={props.workbench.startingView}/>
            </>
        </div>
    );
}

