import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../hooks';
import {addView, changeFocus} from '../store/ordinoSlice';
import {AddButton} from './workbench/AddButton';

export function Breadcrumb() {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();

    return (
        <>
            <nav className="ms-1 d-flex" aria-label="breadcrumb">
                <ol className="breadcrumb m-2">
                    {ordino.workbenches.map((w) => {
                        return (
                            <li className="breadcrumb-item" key={w.id}>
                                <button
                                    type="button"
                                    className={`btn p-0 shadow-none ${ordino.focusViewIndex === w.index
                                        ? 'btn-icon-primary fw-bold'
                                        : ordino.focusViewIndex - 1 === w.index
                                            ? 'btn-icon-success'
                                            : 'btn-icon-gray'
                                        }`}
                                    onClick={() => dispatch(changeFocus({index: w.index}))}
                                >
                                    {w.name}
                                </button>
                            </li>
                        );
                    })}
                </ol>
            </nav>

            <AddButton/>
        </>
    );
}
