import React from 'react';

export interface IBurgerButtonProps {
    onClick: () => void;
}

export function BurgerButton(props: IBurgerButtonProps) {
    return (
        <button className="btn btn-icon-gray shadow-none transition-one" type="button" onClick={() => props.onClick()}>
            <i className="fas fa-bars"></i>
        </button>
    );
}
