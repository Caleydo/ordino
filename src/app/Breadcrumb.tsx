import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../hooks';
import {addView, changeFocus} from '../store/ordinoSlice';
import {AddButton} from './workbench/AddButton';

export function Breadcrumb() {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();

    return (
        <nav className="ms-1 d-flex" aria-label="breadcrumb">
            <ol className="breadcrumb m-2">
                {ordino.workbenches.map((v: any) => {
                    return (
                        <li className="breadcrumb-item" key={v.index}>
                            <button
                                type="button"
                                className={`btn p-0 shadow-none ${ordino.focusViewIndex === v.index
                                    ? 'btn-icon-primary fw-bold'
                                    : ordino.focusViewIndex - 1 === v.index
                                        ? 'btn-icon-success'
                                        : 'btn-icon-gray'
                                    }`}
                                onClick={() => dispatch(changeFocus({index: v.index}))}
                            >
                                {v.name}
                            </button>
                        </li>
                    );
                })}

                <li className="breadcrumb-item" >
                    <AddButton/>
                </li>
            </ol>
        </nav>
    );
}
