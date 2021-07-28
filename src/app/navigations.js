import { authRoles } from './auth/authRoles'

export const navigations = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'dashboard',
    },    
    // {
    //     name: 'SKPD',
    //     path: '/skpd',
    //     icon: 'users',
    //     auth: authRoles.admin,
    // },    
    {
        name: 'Admin',
        path: '/skpd',
        icon: 'users',
        auth: authRoles.admin,
    },    
    {
        name: 'SKPD',
        path: '/skpd',
        icon: 'users',
        auth: authRoles.skpd,
    },    
    {
        name: 'SKPD Admin',
        path: '/skpd',
        icon: 'users',
        auth: authRoles.skpd_admin,
    },    
    {
        label: 'Components',
        type: 'label',
    },
]
