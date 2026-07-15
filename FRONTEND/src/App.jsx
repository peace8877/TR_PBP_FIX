import { useNavigate } from "react-router-dom";
import { SlLogin } from "react-icons/sl";
import logo from "./assets/logo.png";

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-white flex flex-col">
      {/* Backdrop decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-200/50 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full px-4 pt-6">
        <div className="bg-white/70 backdrop-blur rounded-2xl shadow-sm border border-white/60 px-5 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Caffe Moka
          </h1>

          <button
            onClick={() => navigate("/login")}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-xl flex items-center transition duration-300 shadow-sm"
          >
            <SlLogin className="mr-2 text-lg" />
            Masuk
          </button>
        </div>
      </header>

      {/* Konten Utama */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm p-7 sm:p-9">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 mb-4">
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                <span className="text-sm font-semibold">Sistem Kasir Modern</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                Sistem Kasir Modern untuk Kafe Anda
              </h2>

              <p className="text-base sm:text-lg text-gray-600 mt-4 mb-7">
                Kelola pesanan, pantau penjualan, dan layani pelanggan lebih cepat.
                Semua dalam satu platform yang mudah digunakan.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-5 rounded-xl transition duration-300 shadow-sm"
                >
                  Buka Dashboard
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-2 px-5 rounded-xl border border-gray-200 transition duration-300 shadow-sm"
                >
                  Login
                </button>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-sm p-4 sm:p-6">
              <img
                src={logo}
                alt="Logo Caffe Moka"
                className="w-full rounded-2xl shadow-2xl border border-white/60 object-cover"
              />

              <div className="mt-4 flex items-start gap-3 text-sm text-gray-600">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-500" />
                <p>
                  Tampilan yang rapi membantu kasir fokus ke transaksi. UI responsif
                  untuk layar kecil sampai besar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
