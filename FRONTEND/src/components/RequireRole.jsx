import { Navigate } from "react-router-dom";

export default function RequireRole({ role, children }) {
  const auth = (() => {
    try {
      return JSON.parse(localStorage.getItem("auth") || "null");
    } catch {
      return null;
    }
  })();

  if (!auth?.role) return <Navigate to="/login" replace />;
  if (auth.role !== role) {
    return <Navigate to={role === "admin" ? "/dashboard" : "/cashier"} replace />;
  }

  return children;
}

