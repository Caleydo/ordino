import React from 'react';

export function ConfigurationMenu ({
    extensions: {menuItems}
}: {
    extensions: {
        menuItems: React.ReactElement | null;
    };
}) {
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
