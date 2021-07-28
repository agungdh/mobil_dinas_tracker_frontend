import React, { createContext, useEffect, useReducer } from 'react'
import jwtDecode from 'jwt-decode'
import axios from '../apis/backend'
import { MatxLoading } from 'app/components'
import Swal from 'sweetalert2'

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
}

const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false
    }

    // const decodedToken = jwtDecode(accessToken)
    // const currentTime = Date.now() / 1000
    // console.log(decodedToken)
    // return decodedToken.exp > currentTime

    return true;
}

const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    } else {
        localStorage.removeItem('accessToken')
        delete axios.defaults.headers.common.Authorization
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT': {
            const { isAuthenticated, token, user } = action.payload

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                token: action.payload.token,
                user: action.payload.user,
            }
        }
        case 'LOGIN': {
            console.log({action, payload: action.payload});
            return {
                ...state,
                isAuthenticated: true,
                token: action.payload.token,
                user: action.payload.user,
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        case 'REGISTER': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    login: () => Promise.resolve(),
    logout: () => {},
    register: () => Promise.resolve(),
})

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const login = async (email, password) => {
        await axios.post('/acquireToken', {
            email,
            password,
        }).then(function (response) {
            // handle success
            console.log({response});

            setSession(response.data.token)

            dispatch({
                type: 'LOGIN',
                payload: {
                    token: response.data.token,
                    user: response.data.user,
                },
            })
        }).catch(function (error) {
            if (error.response.status === 401) {
                Swal.fire(
                    'Login Gagal !!!',
                    'Email/Password Salah !!!',
                    'error'
                )
            } 
            console.log({error});
        })
    }

    const register = async (email, username, password) => {
        const response = await axios.post('/api/auth/register', {
            email,
            username,
            password,
        })

        const { accessToken, user } = response.data

        setSession(accessToken)

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
            },
        })
    }

    const logout = () => {
        axios.get('/logout').then(function (response) {
            // handle success
            console.log({response});
        }).catch(function (error) {
            
            console.log({error});
        })
        console.log("Logging out");

        setSession(null)
        dispatch({ type: 'LOGOUT' })
    }

    useEffect(() => {
        ;(async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken')

                if (accessToken && isValidToken(accessToken)) {
                    setSession(accessToken)
                    const response = await axios.post('/getTokenInfo')
                    console.log({response});
                    const data = response.data
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: true,
                            user: data,
                            token: accessToken,
                        },
                    })
                } else {
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: false,
                        },
                    })
                }
            } catch (err) {
                console.error(err)
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        })()
    }, [])

    if (!state.isInitialised) {
        return <MatxLoading />
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
