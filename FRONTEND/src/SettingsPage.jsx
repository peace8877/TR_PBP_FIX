import { useState } from "react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profil");

  const tabs = [
    { id: "profil", label: "Profil Toko" },
    { id: "struk", label: "Struk & Pajak" },
    { id: "akun", label: "Akun & Keamanan" },
  ];

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
            {tabs.map(tab => (
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
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Profil Toko</h2>
                <p className="text-sm text-gray-500 mt-1 mb-6">Informasi ini akan muncul di struk Anda.</p>
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-gray-600">Nama Toko</label><input defaultValue="Caffe Moka" className="mt-2 w-full h-11 rounded-2xl bg-white border border-gray-200 px-4" /></div>
                  <div><label className="text-xs font-bold text-gray-600">Alamat</label><textarea defaultValue="Jl. Kopi Enak No. 123, Jakarta" className="mt-2 w-full rounded-2xl bg-white border border-gray-200 px-4 py-2" rows={3}></textarea></div>
                  <div><label className="text-xs font-bold text-gray-600">Nomor Telepon</label><input defaultValue="0812-3456-7890" className="mt-2 w-full h-11 rounded-2xl bg-white border border-gray-200 px-4" /></div>
                </div>
              </div>
            )}
            {activeTab === 'struk' && (
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Struk & Pajak</h2>
                <p className="text-sm text-gray-500 mt-1 mb-6">Atur tampilan struk dan tarif pajak.</p>
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-gray-600">Footer Struk</label><input defaultValue="Terima kasih telah berkunjung!" className="mt-2 w-full h-11 rounded-2xl bg-white border border-gray-200 px-4" /></div>
                  <div><label className="text-xs font-bold text-gray-600">Tarif Pajak (%)</label><input type="number" defaultValue="11" className="mt-2 w-full h-11 rounded-2xl bg-white border border-gray-200 px-4" /></div>
                </div>
              </div>
            )}
            {activeTab === 'akun' && (
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Akun & Keamanan</h2>
                <p className="text-sm text-gray-500 mt-1 mb-6">Kelola informasi login dan keamanan akun Anda.</p>
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-gray-600">Email Login</label><input type="email" defaultValue="admin@moka.com" className="mt-2 w-full h-11 rounded-2xl bg-white border border-gray-200 px-4" /></div>
                  <button className="h-11 px-5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition">Ubah Password</button>
                </div>
              </div>
            )}
             <div className="mt-6 border-t border-gray-200 pt-5 flex justify-end">
                <button className="h-11 px-6 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition">Simpan Perubahan</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
