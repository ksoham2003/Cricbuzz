import { createBrowserRouter, RouterProvider } from "react-router";
import AuthProtection from "../protectedRoutes/AuthProtection";
import AuthLayout from "../Layout/AuthLayout";
import MainLayout from "../Layout/MainLayout";
import LandingLayout from "../layouts/LandingLayout";
import LoginPage from "../features/auth/ui/pages/LoginPage";
import Register from "../features/auth/ui/pages/Register";
import DashboardPage from "../features/dashboard/ui/pages/DashboardPage";
import LandingPage from "../pages/LandingPage";

let AuthRoutes = () => {
  let router = createBrowserRouter([
    // Public layout (Navbar + Sidebar) wraps all public & auth routes
    {
      element: <LandingLayout />,
      children: [
        // Landing page — fully public, no auth check
        {
          path: "/",
          element: <LandingPage />,
        },
        // Auth-gated routes (login, register, dashboard)
        {
          element: <AuthProtection />,
          children: [
            {
              element: <AuthLayout />,
              children: [
                {
                  path: "login",
                  element: <LoginPage />,
                },
                {
                  path: "register",
                  element: <Register />,
                },
              ],
            },
            {
              path: "dashboard",
              element: <MainLayout />,
              children: [
                {
                  path: "",
                  element: <DashboardPage />,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AuthRoutes;
