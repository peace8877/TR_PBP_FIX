import HeaderCashier from "../../components/cashier/HeaderCashier";
import SidebarCashier from "../../components/cashier/SidebarCashier";

export default function CashierProfilePage() {
  return (
    <div className="min-h-screen bg-mokkaCream">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex gap-5">
          <SidebarCashier onLogout={() => (window.location.href = "/login")} />

          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <HeaderCashier />

            <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 sm:p-7">
              <h1 className="text-2xl font-extrabold text-gray-900">Profil Kasir</h1>
              <p className="text-sm text-gray-500 mt-2">Halaman profil kasir (placeholder).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

