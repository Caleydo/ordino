import React from 'react';


interface ILoginMenuProps {
    username: string;
}

export function LoginMenu({username = 'admin'}: ILoginMenuProps) {
    return <li className="nav-item dropdown" id="user_menu">
        <a href="#" className="nav-link" data-bs-toggle="dropdown" role="button" aria-haspopup="true" id="userMenuDropdown" aria-expanded="false">
            <i className="fas fa-user" aria-hidden="true"></i>
            <span className="ms-1">jovial_banach</span></a>
        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuDropdown">
            <a className="dropdown-item" href="#" id="logout_link">Logout</a>
        </div>
    </li>;
}
