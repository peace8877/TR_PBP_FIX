import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./Login";
import DashboardPage from "./DashboardPage";
import DashboardHomePage from "./DashboardHomePage";
import ProductsPage from "./ProductsPage";
import CategoriesPage from "./CategoriesPage";
import TablesPage from "./TablesPage";
import CustomersPage from "./CustomersPage";
import TransactionsPage from "./TransactionsPage";
import ReportsPage from "./ReportsPage";
import UsersPage from "./UsersPage";
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import CashierDashboardPage from "./pages/cashier/CashierDashboardPage";
import CashierTransactionsPage from "./pages/cashier/CashierTransactionsPage";
import CashierHistoryPage from "./pages/cashier/CashierHistoryPage";
import CashierProfilePage from "./pages/cashier/CashierProfilePage";
import RequireRole from "./components/RequireRole";


export const router = createBrowserRouter([
  {
    path: "/", // Halaman utama
    element: <App />,
  },
  {
    path: "/login", // Halaman login
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <RequireRole role="admin">
        <DashboardPage />
      </RequireRole>
    ),
    children: [
      { index: true, element: <DashboardHomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "tables", element: <TablesPage /> },
      { path: "customers", element: <CustomersPage /> },
      { path: "transactions", element: <TransactionsPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  {
    path: "/cashier",
    element: (
      <RequireRole role="cashier">
        <CashierDashboardPage />
      </RequireRole>
    ),
  },
  {
    path: "/cashier/transactions",
    element: (
      <RequireRole role="cashier">
        <CashierTransactionsPage />
      </RequireRole>
    ),
  },
  {
    path: "/cashier/history",
    element: (
      <RequireRole role="cashier">
        <CashierHistoryPage />
      </RequireRole>
    ),
  },
  {
    path: "/cashier/profile",
    element: (
      <RequireRole role="cashier">
        <CashierProfilePage />
      </RequireRole>
    ),
  },
]);
