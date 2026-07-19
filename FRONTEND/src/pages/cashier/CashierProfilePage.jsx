import { useEffect, useState } from "react";
import HeaderCashier from "../../components/cashier/HeaderCashier";
import SidebarCashier from "../../components/cashier/SidebarCashier";

export default function CashierProfilePage() {
  const [user, setUser] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', 
      hour: '2-digit', minute: '2-digit'
    });
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/profile", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`, "Accept": "application/json" }
      });
      if (response.ok) setUser(await response.json());
    } catch (error) { console.error(error); }
  };

  const handleLogout = async () => {
    await fetch("http://127.0.0.1:8000/api/logout", {
      method: "POST",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => { fetchProfile(); }, []);

  return (
    <div className="min-h-screen bg-mokkaCream p-6">
      <div className="flex gap-5 max-w-[1400px] mx-auto">
        <SidebarCashier onLogout={handleLogout} />
        <div className="flex-1 bg-white/70 p-8 rounded-3xl border border-white/60">
          <h1 className="text-2xl font-extrabold mb-6">Profil Staf</h1>
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[ {label: "Nama", val: user.name}, {label: "Email", val: user.email},
                 {label: "Status", val: user.status, isStatus: true},
                 {label: "Terakhir Aktif", val: formatDate(user.last_active_at)},
                 {label: "Terakhir Logout", val: formatDate(user.last_inactive_at)}
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white/50 rounded-2xl border border-white/50">
                  <p className="text-xs font-bold text-gray-500 uppercase">{item.label}</p>
                  <p className={`text-lg font-bold ${item.isStatus ? (user.status === 'Aktif' ? 'text-emerald-600' : 'text-red-600') : 'text-gray-800'}`}>
                    {item.val}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}