import { Outlet, Navigate } from "react-router-dom";
import { LOCAL_USER } from "../constants.js";

export const ProtectedRoutes = () => {
    const user = localStorage.getItem(LOCAL_USER);
    return user ? <Outlet /> : <Navigate to="/sign-in" />;
}

export const GuestRoutes = () => {
    const user = localStorage.getItem(LOCAL_USER);
    return user ? <Navigate to="/" /> : <Outlet />;
}