import { useState } from "react";
import { FiBell } from "react-icons/fi";
import { HiOutlineChevronDown } from "react-icons/hi";
import { BsCalendarEvent } from "react-icons/bs";

const Topbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-white rounded-3xl border border-white/70 shadow-soft px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-mokkaDark">
          Selamat Datang, Admin! 👋
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Kelola bisnis kafe Anda dengan mudah.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifikasi */}
        <button
          type="button"
          className="h-11 w-11 rounded-2xl bg-mokkaCream hover:bg-mokkaCream/80 border border-mokkaCoffee/10 flex items-center justify-center transition duration-300"
          aria-label="Notifikasi"
        >
          <FiBell className="text-mokkaCoffee text-xl" />
        </button>

        {/* Avatar + info */}
        <div className="hidden md:flex items-center gap-3 bg-mokkaCream/60 border border-mokkaCoffee/10 rounded-3xl px-4 py-2">
          <div className="h-11 w-11 rounded-2xl bg-mokkaCoffee/10 border border-mokkaCoffee/20 flex items-center justify-center">
            <span className="text-mokkaCoffee font-extrabold">AM</span>
          </div>

          <div className="leading-tight">
            <p className="font-bold text-gray-900">Admin Moka</p>
            <p className="text-xs text-gray-500">Pemilik</p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="ml-2 p-2 rounded-xl hover:bg-white/70 transition duration-300"
              aria-label="Dropdown"
            >
              <HiOutlineChevronDown className="text-gray-700" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-3xl border border-gray-100 shadow-lg p-2 z-10">
                <button className="w-full text-left px-3 py-2 rounded-2xl hover:bg-mokkaCoffee/10 transition duration-300 text-sm font-semibold">
                  Profil
                </button>
                <button className="w-full text-left px-3 py-2 rounded-2xl hover:bg-mokkaCoffee/10 transition duration-300 text-sm font-semibold">
                  Pengaturan
                </button>
                <button className="w-full text-left px-3 py-2 rounded-2xl hover:bg-mokkaCoffee/10 transition duration-300 text-sm font-semibold">
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Date Picker (dummy) */}
        <div className="hidden lg:flex items-center gap-2 bg-mokkaCream/60 border border-mokkaCoffee/10 rounded-3xl px-4 py-2">
          <BsCalendarEvent className="text-mokkaCoffee text-lg" />
          <input
            type="date"
            className="bg-transparent outline-none text-sm font-semibold text-gray-900"
            aria-label="Tanggal"
          />
        </div>

        {/* Mobile dropdown trigger */}
        <button
          type="button"
          className="md:hidden h-11 w-11 rounded-2xl bg-mokkaCream hover:bg-mokkaCream/80 border border-mokkaCoffee/10 transition duration-300 flex items-center justify-center"
          aria-label="Menu Admin"
          onClick={() => setOpen((v) => !v)}
        >
          <HiOutlineChevronDown className="text-gray-800 text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
