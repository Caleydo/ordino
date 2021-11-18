import React from 'react';

export interface IViewChooserHeaderProps {
    children?: React.ReactNode;
}

export function ViewChooserHeader({children}: IViewChooserHeaderProps) {
    return <header className="d-flex my-2 px-1 justify-content-center align-items-center flex-nowrap">
        {children}
    </header>;
}
