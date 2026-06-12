import React from 'react'
import { Outlet } from 'react-router'

const AuthProtection = () => {
    return (
        <Outlet />
    )
}

export default AuthProtection
