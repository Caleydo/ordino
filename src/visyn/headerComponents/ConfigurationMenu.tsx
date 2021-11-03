import React, {ComponentType} from 'react';

export interface IConfigurationMenuProps {
    extensions: {
        menuItems: React.ReactElement | null;
    };
}

export function ConfigurationMenu({
    extensions: {menuItems}
}: IConfigurationMenuProps) {
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
                    {menuItems}
                </li>
            </ul>
        </>
    );
}
