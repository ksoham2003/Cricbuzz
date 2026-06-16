import { useAuthStore } from '../context/authStore';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { getCurrentUser, isAuthenticated, isLoading, user } = useAuthStore();
  const [checked, setChecked] = useState(isAuthenticated);
  const location = useLocation();

  useEffect(() => {
    let alive = true;

    if (!isAuthenticated) {
      getCurrentUser()
        .catch(() => {})
        .finally(() => {
          if (alive) setChecked(true);
        });
    } else {
      setChecked(true);
    }

    return () => {
      alive = false;
    };
  }, [getCurrentUser, isAuthenticated]);

  if (isLoading || !checked) {
    return (
      <div className="page-shell">
        <div className="state-panel">Checking your session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
