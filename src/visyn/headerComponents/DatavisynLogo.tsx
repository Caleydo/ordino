import * as React from 'react';
import datavisynLogo from 'ordino/dist/assets/logos/datavisyn_white.svg';

export function DatavisynLogo() {
    return (
        <li className="nav-item">
            <a href="https://datavisyn.io/" rel="noreferrer" target="_blank" className="nav-link">
                <img src={datavisynLogo} alt="logo" style={{height: '24px'}} />
            </a>
        </li>
    );
}
