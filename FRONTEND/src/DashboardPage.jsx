import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";


const DashboardPage = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    // placeholder logout
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
              <div className="lg:hidden fixed inset-0 z-50">
                <div
                  className="absolute inset-0 bg-black/30"
                  onClick={() => setDrawerOpen(false)}
                />
                <div className="absolute left-4 top-4 right-4 bottom-4">
                  <div className="h-full overflow-hidden">
                    <div className="h-full">
                      <div className="bg-mokkaCream/70 backdrop-blur h-full rounded-3xl border border-white/60 p-3 shadow-lg flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-extrabold text-mokkaDark">
                            Caffe Moka
                          </p>
                          <button
                            type="button"
                            className="h-10 w-10 rounded-3xl bg-white border border-white/70 shadow-soft flex items-center justify-center"
                            onClick={() => setDrawerOpen(false)}
                            aria-label="Close drawer"
                          >
                            <RxCross2 className="text-mokkaCoffee text-xl" />
                          </button>
                        </div>
                        <div className="flex-1 overflow-auto">
                          <Sidebar onLogout={handleLogout} />
                        </div>
                      </div>
                    </div>
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
