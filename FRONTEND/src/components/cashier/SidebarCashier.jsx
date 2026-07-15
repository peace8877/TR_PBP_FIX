import { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  History,
  UserRound,
  LogOut,
} from "lucide-react";

import logo from "../../assets/logo.png";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/cashier" },
  { label: "Transaksi", icon: ShoppingBag, to: "/cashier/transactions" },
  {
    label: "Riwayat Transaksi",
    icon: History,
    to: "/cashier/history",
  },
  { label: "Profil", icon: UserRound, to: "/cashier/profile" },
];

function SidebarCashier({ onLogout, isCollapsed = false }) {
  const location = useLocation();

  const activeLabel = useMemo(() => {
    const match = menuItems.find((m) => m.to === location.pathname);
    return match?.label ?? "Dashboard";
  }, [location.pathname]);

  return (
    <aside
      className={[
        "hidden lg:flex lg:flex-col",
        "h-screen w-[260px] bg-white rounded-3xl border border-white/70 shadow-soft",
        "overflow-hidden",
      ].join(" ")}
    >
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-mokkaCoffee/10 border border-mokkaCoffee/20 flex items-center justify-center">
            <img src={logo} alt="Caffe Moka" className="h-7 w-7 object-contain" />
          </div>
          <div className="leading-tight">
            <p className="font-extrabold text-mokkaDark">Caffe Moka</p>
            <p className="text-xs text-gray-500">CafePOS Kasir</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 pb-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 w-full rounded-2xl px-3 py-2 transition duration-300",
                    "text-sm font-semibold",
                    isActive
                      ? "bg-mokkaCoffee text-white"
                      : "bg-transparent text-gray-700 hover:bg-mokkaCoffee/10 hover:text-mokkaCoffee",
                  ].join(" ")
                }
              >
                <Icon className="text-xl transition duration-300" />
                <span className={isCollapsed ? "hidden" : ""}>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100 bg-white/50">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition duration-300 hover:bg-mokkaCoffee/10"
        >
          <LogOut className="text-xl text-mokkaCoffee" />
          <span className="text-gray-800">Logout</span>
        </button>

        <p className="mt-3 text-xs text-gray-500">
          Active: <span className="font-semibold">{activeLabel}</span>
        </p>
      </div>
    </aside>
  );
}

export default SidebarCashier;

