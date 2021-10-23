import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {changeFocus} from '../store/ordinoSlice';

export function Breadcrumb() {
    const ordino: any = useSelector<any>((state) => state.ordino) as any;
    const dispatch = useDispatch();

    return (
        <nav className="ms-1 d-flex" aria-label="breadcrumb">
            <ol className="breadcrumb m-1">
                {ordino.views.map((v: any) => {
                    return (
                        <li className="breadcrumb-item" key={v.id}>
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
            </ol>
        </nav>
    );
}
