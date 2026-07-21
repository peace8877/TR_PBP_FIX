import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";


const DashboardPage = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("http://127.0.0.1:8000/api/logout", {
      method: "POST",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-mokkaCream">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-5">
          {/* Sidebar Desktop */}
          <Sidebar onLogout={handleLogout} />

          {/* Content */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Mobile header with drawer */}
            <div className="lg:hidden flex items-center justify-between">
              <button
                type="button"
                className="rounded-3xl bg-white border border-white/70 shadow-soft px-4 py-3 font-extrabold text-mokkaCoffee"
                onClick={() => setDrawerOpen(true)}
              >
                Menu
              </button>
              <NavLink to="/dashboard" className="hidden">
                Dashboard
              </NavLink>
            </div>

            {/* Mobile Drawer */}
             {drawerOpen ? (
  <div className="lg:hidden fixed inset-0 z-50 flex">
    {/* Backdrop gelap transparan di latar belakang */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      onClick={() => setDrawerOpen(false)}
    />
    
    {/* Container Drawer (Menempel penuh di kiri, lebar pas, isi tidak meluber) */}
    <div className="relative h-full w-72 max-w-[80vw] bg-mokkaCream/95 backdrop-blur border-r border-white/60 p-5 shadow-2xl flex flex-col animate-slide-in">
      
      {/* Header bagian dalam drawer */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <span className="font-extrabold text-xl text-mokkaDark tracking-wider">
          POSTI
        </span>
        <button
          type="button"
          className="h-10 w-10 rounded-full bg-white border border-gray-100 shadow-soft flex items-center justify-center active:scale-95 transition"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close drawer"
        >
          <RxCross2 className="text-mokkaCoffee text-lg font-bold" />
        </button>
      </div>

      {/* Konten Utama: Sidebar Admin Anda */}
      <div className="flex-1 overflow-y-auto pr-1">
        <Sidebar onLogout={handleLogout} />
      </div>
      
    </div>
  </div>
) : null}

            {/* Topbar */}
            <Topbar />

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
