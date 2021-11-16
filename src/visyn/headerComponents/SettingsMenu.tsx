import React, {ComponentType} from 'react';

export interface ISettingsMenuProps {
    menuItems?: React.ReactElement | null;
}

export function SettingsMenu({
    menuItems = null
}: ISettingsMenuProps) {
    return (
        <>
            <ul className="ms-2 navbar-right navbar-nav">
                <li className="nav-item dropdown" id="user_menu">
                    <a
                        href="#"
                        className="nav-link dropdown-toggle"
                        data-bs-toggle="dropdown"
                        role="button"
                        aria-haspopup="true"
                        id="userMenuDropdown"
                        aria-expanded="false"
                    >
                        <i className="fas fa-ellipsis-v text-light"></i>
                    </a>
                    <div
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby="userMenuDropdown"
                    >
                        <button className="dropdown-item">Login</button>
                        <button className="dropdown-item">Logout</button>
                    </div>
                </li>
            </ul>
        </>
    );
}
