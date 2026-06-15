import React, { useEffect } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { getMeApi } from '../features/auth/api/AuthApi'
import { addUser, logoutUser, setLoading } from '../features/auth/state/slice/AuthSlice'

const AuthProtection = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const { user, isLoading, isAuthenticated } = useSelector((state) => state.auth)

    useEffect(() => {
        const checkSession = async () => {
            try {
                dispatch(setLoading(true))
                const userData = await getMeApi()
                dispatch(addUser(userData))
            } catch {
                dispatch(logoutUser())
            }
        }

        // Only restore session if we don't have a user and haven't tried fetching yet
        if (!user && isAuthenticated === false) {
            checkSession()
        } else {
            dispatch(setLoading(false))
        }
    }, [dispatch, user, isAuthenticated])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Restoring session...</p>
                </div>
            </div>
        )
    }

    const isAuthPage = location.pathname === "/" || location.pathname === "/register"

    if (!isAuthenticated && !isAuthPage) {
        // Redirect anonymous users trying to access protected paths (like /dashboard)
        return <Navigate to="/" replace />
    }

    if (isAuthenticated && isAuthPage) {
        // Redirect authenticated users away from login/register pages
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}

export default AuthProtection;
