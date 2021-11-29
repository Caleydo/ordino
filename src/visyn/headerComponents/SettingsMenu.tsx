import React, {ComponentType} from 'react';

export interface ISettingsMenuProps {
    menuItems?: React.ReactElement | null;
}

export function SettingsMenu({
    menuItems = null
}: ISettingsMenuProps) {
    return (
        <>
            <li className="nav-item dropdown" id="user_menu">
                <a
                    href="#"
                    className="nav-link"
                    data-bs-toggle="dropdown"
                    role="button"
                    aria-haspopup="true"
                    id="userMenuDropdown"
                    aria-expanded="false"
                >
                    <i className="fas fa-ellipsis-v text-light"></i>
                </a>
                <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userMenuDropdown"
                >
                    <button className="dropdown-item">About</button>
                    <button className="dropdown-item">Contact</button>
                    <button className="dropdown-item">More</button>
                </ul>
            </li>
        </>
    );
}
