import React from 'react';

interface IBurgerMenuProps {
    onClick: () => void;
}

export function BurgerMenu(props: IBurgerMenuProps) {
    return (
        <button className="btn btn-icon-gray" type="button" onClick={() => props.onClick()}>
            <i className="fas fa-bars"></i>
        </button>
    );
}
