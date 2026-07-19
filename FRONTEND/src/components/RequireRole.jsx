import { Navigate } from "react-router-dom";

function normalizeRole(role) {
  if (!role) return null;

  const r = String(role).trim();

  // Backend biasanya mengirim: "Admin" / "Kasir"
  if (/^admin$/i.test(r)) return "admin";
  if (/^kasir$/i.test(r)) return "cashier";

  // Kalau frontend sudah menyimpan format ini, biarkan
  if (r === "admin" || r === "cashier") return r;

  return null;
}

export default function RequireRole({ role, children }) {
  const auth = (() => {
    try {
      return JSON.parse(localStorage.getItem("auth") || "null");
    } catch {
      return null;
    }
  })();

  if (!auth?.role) return <Navigate to="/login" replace />;

  const normalizedAuthRole = normalizeRole(auth.role);
  const normalizedRequiredRole = normalizeRole(role) || role; // role prop di router biasanya lowercase

  if (!normalizedAuthRole || normalizedAuthRole !== normalizedRequiredRole) {
    return <Navigate to={normalizedRequiredRole === "admin" ? "/dashboard" : "/cashier"} replace />;
  }

  return children;
}


