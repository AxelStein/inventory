import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
    layout('MainLayout.tsx', [
        route('/auth', 'auth/AuthLayout.tsx', [
            route('sign-in', 'auth/routes/sign-in.tsx'),
            route('sign-up', 'auth/routes/sign-up.tsx'),
            route('reset-password', 'auth/routes/reset-password.tsx'),
            route('verify-email', 'auth/routes/verify-email.tsx'),
        ]),
        route('/', 'dashboard/routes/index.tsx'),
        route('/user', 'user/UserLayout.tsx', [
            route(':id', 'user/routes/[id].tsx'),
        ]),
        route('/inventory', 'inventory/components/InventoryLayout.tsx', [
            route(':id', 'inventory/routes/[id].tsx')
        ]),
        route('/inventory-list', 'inventory_list/routes/index.tsx'),
        route('/privacy', 'privacy_policy/PrivacyLayout.tsx', [
            route('', 'privacy_policy/routes/index.tsx'),
            route('data-deletion', 'privacy_policy/routes/data-deletion.tsx')
        ])
    ]),

] satisfies RouteConfig;
