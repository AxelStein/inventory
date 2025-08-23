import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthInterceptor from '../auth/AuthInterceptor.js';
import AuthPage from '../auth/AuthPage.js';
import DashboardPage from '../dashboard/DashboardPage.js';
import ResetPasswordPage from '../auth/ResetPasswordPage.js';
import { GuestRoutes, ProtectedRoutes } from "./protected.js";

const router = (
    <BrowserRouter>
        <AuthInterceptor />
        <Routes>
            <Route element={<GuestRoutes />}>
                <Route path='/sign-up' element={<AuthPage isSignIn={false} />} />
                <Route path='/sign-in' element={<AuthPage isSignIn={true} />} />
                <Route path='/reset-password' element={<ResetPasswordPage/>}/>
            </Route>
            <Route element={<ProtectedRoutes />}>
                <Route path='/' element={<DashboardPage />} />
            </Route>
            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
    </BrowserRouter>
)

export default router;