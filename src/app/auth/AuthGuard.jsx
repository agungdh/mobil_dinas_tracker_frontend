import React, {
    useContext,
    useEffect,
    useState,
} from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import AppContext from "app/contexts/AppContext";
import useAuth from 'app/hooks/useAuth'

const getUserRoleAuthStatus = (pathname, user, routes) => {
  const matched = routes.find((r) => r.path === pathname);

  const authenticated =
    matched && matched.auth && matched.auth.length
      ? matched.auth.includes(user.role)
      : true;
  console.log(matched, user);
  return authenticated;
};

const AuthGuard = ({ children }) => {
    const {
        isAuthenticated,
        user
    } = useAuth()

    const [previouseRoute, setPreviousRoute] = useState(null)
    const { pathname } = useLocation()

    const { routes } = useContext(AppContext);
    if (!isAuthenticated) {
        return (
            <Redirect
                to={{
                    pathname: '/session/signin',
                    // state: { redirectUrl: previouseRoute },
                }}
            />
        )
    }
    const isUserRoleAuthenticated =  getUserRoleAuthStatus(pathname, user, routes);
    let authenticated = isAuthenticated;

    // IF YOU NEED ROLE BASED AUTHENTICATION,
    // UNCOMMENT ABOVE TWO LINES, getUserRoleAuthStatus METHOD AND user VARIABLE
    // AND COMMENT OUT BELOW LINE
    // let authenticated = isAuthenticated

    // useEffect(() => {
    //     if (previouseRoute !== null) setPreviousRoute(pathname)
    // }, [pathname, previouseRoute])

    if (authenticated) {
        if (isUserRoleAuthenticated) {
            return <>{children}</>
        } else {
            return (<Redirect
                to={{
                    pathname: '/',
                    // state: { redirectUrl: previouseRoute },
                }}
            />)
        }
    }
    else {
        return (
            <Redirect
                to={{
                    pathname: '/session/signin',
                    // state: { redirectUrl: previouseRoute },
                }}
            />
        )
    }
}

export default AuthGuard
