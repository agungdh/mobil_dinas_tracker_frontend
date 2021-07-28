import React, { Fragment } from 'react'
import Scrollbar from 'react-perfect-scrollbar'
import { navigations } from 'app/navigations'
import { MatxVerticalNav } from 'app/components'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import useSettings from 'app/hooks/useSettings'
import { authRoles } from '../../auth/authRoles'
import useAuth from 'app/hooks/useAuth'

const useStyles = makeStyles(({ palette, ...theme }) => ({
    scrollable: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    sidenavMobileOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: '100vw',
        background: 'rgba(0, 0, 0, 0.54)',
        zIndex: -1,
        [theme.breakpoints.up('lg')]: {
            display: 'none',
        },
    },
}))

const Sidenav = ({ children }) => {
    const classes = useStyles()
    const { settings, updateSettings } = useSettings()
    const { logout, user } = useAuth()

    const updateSidebarMode = (sidebarSettings) => {
        let activeLayoutSettingsName = settings.activeLayout + 'Settings'
        let activeLayoutSettings = settings[activeLayoutSettingsName]

        updateSettings({
            ...settings,
            [activeLayoutSettingsName]: {
                ...activeLayoutSettings,
                leftSidebar: {
                    ...activeLayoutSettings.leftSidebar,
                    ...sidebarSettings,
                },
            },
        })
    }

    const getfilteredNavigations = (navList = [], role) => {
        return navList.reduce((array, nav) => {
            if (nav.auth) {
                if (nav.auth.includes(role)) {
                    array.push(nav)
                }
            } else {
                if (nav.children) {
                    nav.children = getfilteredNavigations(nav.children, role)
                    array.push(nav)
                } else {
                    array.push(nav)
                }
            }
            return array
        }, [])
    }
    let filteredNavigations = getfilteredNavigations(navigations, user.role);

    return (
        <Fragment>
            <Scrollbar
                options={{ suppressScrollX: true }}
                className={clsx('relative px-4', classes.scrollable)}
            >
                {children}
                <MatxVerticalNav items={filteredNavigations} />
            </Scrollbar>

            <div
                onClick={() => updateSidebarMode({ mode: 'close' })}
                className={classes.sidenavMobileOverlay}
            />
        </Fragment>
    )
}

export default Sidenav
