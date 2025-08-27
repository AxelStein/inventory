import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
    route('/auth', 'auth/AuthLayout.tsx', [
        route('sign-in', 'auth/routes/sign-in.tsx'),
        route('sign-up', 'auth/routes/sign-up.tsx'),
        route('reset-password', 'auth/routes/reset-password.tsx'),
        route('verify-email', 'auth/routes/verify-email.tsx'),
    ]),

    route('/', 'dashboard/routes/index.tsx'),
    route('/user', 'user/UserLayout.tsx', [
        route(':id', 'user/routes/[id].tsx'),
    ])
] satisfies RouteConfig;
