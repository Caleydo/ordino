import React from 'react';

export interface IViewChooserFooterProps {
    children: React.ReactNode;
}

export function ViewChooserFooter(props) {
    return <div className="chooser-footer border-top border-light d-flex justify-content-center">
        {
            props.children
        }
        <button className="btn btn-icon-gray btn-lg">
            <i className="fab fa-github"></i>
        </button>
    </div>;
}
