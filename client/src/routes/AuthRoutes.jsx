import { createBrowserRouter, RouterProvider } from "react-router"
import AuthProtection from "../protectedRoutes/AuthProtection"
import AuthLayout from "../Layout/AuthLayout"
import MainLayout from "../Layout/MainLayout"
import LoginPage from "../features/auth/ui/pages/LoginPage"
import Register from "../features/auth/ui/pages/Register"
import DashboardPage from "../features/dashboard/ui/pages/DashboardPage"

let AuthRoutes = () => {
    let router = createBrowserRouter([
        {
            path: "/",
            element: <AuthProtection />,
            children: [
                {
                    path: "",
                    element: <AuthLayout />,
                    children: [
                        {
                            path: "",
                            element: <LoginPage />
                        },
                        {
                            path: "register",
                            element: <Register />
                        }
                    ]
                },
                {
                    path: "dashboard",
                    element: <MainLayout />,
                    children: [
                        {
                            path: "",
                            element: <DashboardPage />
                        }
                    ]
                }
            ]
        }
    ])

    return (
        <RouterProvider router={router} />
    )
}

export default AuthRoutes