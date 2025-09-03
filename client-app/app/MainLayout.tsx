import { type User } from "api/user/user.types";
import { useState } from "react";
import { Button, Col, Container, Dropdown, SplitButton, Stack } from "react-bootstrap";
import { Outlet } from "react-router";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useLocalStorage } from 'react-use';

export default function AuthLayout() {
    const [isDarkMode, setDarkMode] = useState(false);
    const [user, setUser] = useLocalStorage<User | null>('user');
    return <div>
        <div className='app-bar'>
            <h5 className='app-bar-title'>Inventory App</h5>
            <div>

                {user != null ? (
                    <SplitButton
                        title={<span className="app-bar-username">{user.name}</span>}
                        variant='outline-primary'
                        href='/user/own'>
                        <Dropdown.Item>Sign out</Dropdown.Item>
                    </SplitButton>
                ) : (
                    <Button variant="link" href="/auth/sign-in">Sign in</Button>
                )}
            </div>
        </div>
        <div className="p-3">
            <Outlet />
        </div>
    </div>;
}