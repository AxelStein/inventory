import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
    route('/auth', 'auth/AuthLayout.tsx', [
        route('sign-in', 'auth/routes/sign-in.tsx'),
        route('sign-up', 'auth/routes/sign-up.tsx'),
        route('reset-password', 'auth/ResetPasswordPage.tsx'),
        route('verify-email', 'auth/EmailVerificationPage.tsx'),
    ]),
] satisfies RouteConfig;
