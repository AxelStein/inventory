import { useEffect, useState } from "react";
import { Dropdown, SplitButton } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import classNames from 'classnames';
import { useDispatch, useSelector } from "react-redux";
import { useSignOutMutation } from "api/auth/auth.api";
import { logout } from "api/slice/auth.slice";
import AppToastContainer from "./components/AppToastContainer";
import { toast } from 'react-toastify';
import { useErrorFormatter } from "./components/error.formatter";

export default function AuthLayout() {
    const [isDarkMode, setDarkMode] = useState(false);
    const user = useSelector((state: any) => state.auth.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [signOut] = useSignOutMutation();
    const { formatError } = useErrorFormatter();

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light')
    }, [isDarkMode]);

    const handleUserClick = () => {
        navigate('/user/own');
    }

    const handleSignOutClick = () => {
        signOut().unwrap()
            .then(() => {
                dispatch(logout());
                navigate('/');
            })
            .catch(err => toast.error(formatError(err)));
    }

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
                        onClick={handleUserClick}
                        title={<span className="app-bar-username">
                            {user.name}
                        </span>}
                        variant='outline-primary'>
                        <Dropdown.Item onClick={handleSignOutClick}>Sign out</Dropdown.Item>
                    </SplitButton>
                ) : (
                    <Link to="/auth/sign-in">Sign in</Link>
                )}
            </div>
        </div>
        <div className="p-3">
            <Outlet />
            <AppToastContainer />
        </div>
    </div>
}