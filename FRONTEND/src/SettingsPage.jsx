import { useState, useEffect } from "react";
import axios from "axios";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profil");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    shop_name: "",
    address: "",
    phone: "",
    receipt_footer: "",
    tax_rate: "",
    email: ""
  });

  // Fetch data dari database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/settings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        // Menggunakan data dari API, jika ada yang null tetap jadi string kosong
        setSettings(prev => ({ ...prev, ...response.data }));
      } catch (error) {
        console.error("Gagal memuat pengaturan:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/settings", settings, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Pengaturan berhasil disimpan!");
    } catch (error) {
      alert("Gagal menyimpan pengaturan.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-0 flex flex-col gap-5">
      <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 sm:p-7">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Pengaturan</h1>
        <p className="text-sm text-gray-500 mt-2">Atur preferensi dan konfigurasi sistem Anda.</p>
      </div>

      <div className="flex gap-5">
        {/* Navigasi Tab */}
        <div className="w-64">
          <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm p-3 space-y-1">
            {[
              { id: "profil", label: "Profil Toko" },
              { id: "struk", label: "Struk & Pajak" },
              { id: "akun", label: "Akun & Keamanan" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2.5 rounded-2xl font-bold text-sm transition ${activeTab === tab.id ? 'bg-mokkaCoffee text-white' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Konten Tab */}
        <div className="flex-1">
          <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm p-6">
            {activeTab === 'profil' && (
              <div className="space-y-4">
                <div><label className="text-xs font-bold text-gray-600">Nama Toko</label>
                  <input name="shop_name" value={settings.shop_name || ""} onChange={handleChange} className="mt-2 w-full h-11 rounded-2xl bg-white border border-gray-200 px-4" /></div>
                <div><label className="text-xs font-bold text-gray-600">Alamat</label>
                  <textarea name="address" value={settings.address || ""} onChange={handleChange} className="mt-2 w-full rounded-2xl bg-white border border-gray-200 px-4 py-2" rows={3}></textarea></div>
                <div><label className="text-xs font-bold text-gray-600">Nomor Telepon</label>
                  <input name="phone" value={settings.phone || ""} onChange={handleChange} className="mt-2 w-full h-11 rounded-2xl bg-white border border-gray-200 px-4" /></div>
              </div>
            )}
            
            {activeTab === 'struk' && (
              <div className="space-y-4">
                <div><label className="text-xs font-bold text-gray-600">Footer Struk</label>
                  <input name="receipt_footer" value={settings.receipt_footer || ""} onChange={handleChange} className="mt-2 w-full h-11 rounded-2xl bg-white border border-gray-200 px-4" /></div>
                <div><label className="text-xs font-bold text-gray-600">Tarif Pajak (%)</label>
                  <input name="tax_rate" type="number" value={settings.tax_rate || ""} onChange={handleChange} className="mt-2 w-full h-11 rounded-2xl bg-white border border-gray-200 px-4" /></div>
              </div>
            )}
            
            {activeTab === 'akun' && (
              <div className="space-y-4">
                <div><label className="text-xs font-bold text-gray-600">Email Login</label>
                  <input name="email" type="email" value={settings.email || ""} onChange={handleChange} className="mt-2 w-full h-11 rounded-2xl bg-white border border-gray-200 px-4" /></div>
              </div>
            )}

            <div className="mt-6 border-t border-gray-200 pt-5 flex justify-end">
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="h-11 px-6 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;