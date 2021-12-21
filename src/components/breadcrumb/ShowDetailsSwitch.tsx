import * as React from 'react';
import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../..';

export interface ShowDetailsSwitchProps {
    height?: number;
}

export function ShowDetailsSwitch({
    height = 30
}: ShowDetailsSwitchProps) {
    const ordino = useAppSelector((state) => state.ordino);
    const dispatch = useAppDispatch();

    const [open, setOpen] = useState<boolean>(false);

    return (
        <div className="form-check form-switch align-middle m-1">
            <input className="form-check-input checked" type="checkbox" id="flexSwitchCheckChecked"/>
            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Show Details</label>
        </div>
    )
}
