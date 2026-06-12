import { createBrowserRouter, RouterProvider } from "react-router"
import AuthProtection from "../protectedRoutes/AuthProtection"
import AuthLayout from "../Layout/AuthLayout"
import LoginPage from "../features/auth/ui/pages/LoginPage"
import Register from "../features/auth/ui/pages/Register"


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
                }
            ]
        }
    ])

    return (
        <RouterProvider router={router} />
    )
}

export default AuthRoutes