const ProfilePage = () => {
  return (
    <div className="min-w-0 flex flex-col gap-5">
      <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-6 sm:p-7">
        <div className="flex items-center gap-4">
           <div className="h-16 w-16 rounded-full bg-mokkaCoffee/10 border border-mokkaCoffee/20 flex items-center justify-center">
            <span className="text-mokkaCoffee text-2xl font-extrabold">AM</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Profil Saya</h1>
            <p className="text-sm text-gray-500 mt-2">Kelola informasi profil dan preferensi Anda.</p>
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm p-6">
        <h2 className="text-lg font-extrabold text-gray-900">Informasi Personal</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-xs font-bold text-gray-600">Nama Lengkap</label><input defaultValue="Admin Moka" className="mt-2 w-full h-11 rounded-2xl bg-white border border-gray-200 px-4" /></div>
          <div><label className="text-xs font-bold text-gray-600">Alamat Email</label><input type="email" defaultValue="admin@moka.com" className="mt-2 w-full h-11 rounded-2xl bg-white border border-gray-200 px-4" /></div>
          <div><label className="text-xs font-bold text-gray-600">Peran</label><input defaultValue="Pemilik" className="mt-2 w-full h-11 rounded-2xl bg-gray-100 border border-gray-200 px-4" disabled /></div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-5 flex justify-end">
            <button className="h-11 px-6 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold border border-gray-900 transition">Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
