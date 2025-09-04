import { useEffect, useState } from "react";
import { Dropdown, SplitButton } from "react-bootstrap";
import { Link, Outlet } from "react-router";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import classNames from 'classnames';
import { useSelector } from "react-redux";

export default function AuthLayout() {
    const [isDarkMode, setDarkMode] = useState(false);
    const user = useSelector((state: any) => state.auth.user);
    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light')
    }, [isDarkMode]);
    return <div>
        <div className={classNames('app-bar', { 'app-bar-dark': isDarkMode })}>
            <Link
                to='/'
                replace={true}
                className="app-bar-title-link">
                <h5 className='app-bar-title'>Inventory App</h5>
            </Link>
            <div>
                <DarkModeSwitch
                    className="me-3"
                    checked={isDarkMode}
                    onChange={setDarkMode}
                />
                {user != null ? (
                    <SplitButton
                        title={<span className="app-bar-username">{user.name}</span>}
                        variant='outline-primary'
                        href='/user/own'>
                        <Dropdown.Item >Sign out</Dropdown.Item>
                    </SplitButton>
                ) : (
                    <Link to="/auth/sign-in">Sign in</Link>
                )}
            </div>
        </div>
        <div className="p-3">
            <Outlet />
        </div>
    </div>
}