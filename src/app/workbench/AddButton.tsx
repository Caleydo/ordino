import React from 'react';
import { EDragTypes } from './utils';
import { useDrag } from 'react-dnd';
import {addView, useAppDispatch, useAppSelector} from '../..';

export function AddButton() {
    const dispatch = useAppDispatch();
    const ordino = useAppSelector((state) => state.ordino);

    const [{}, drag] = useDrag(() => ({
        type: EDragTypes.ADD,
        item: {type: EDragTypes.ADD},

    }));

    return (
        <button ref={drag} type="button" className="btn btn-primary">Add View</button>
    );
}
