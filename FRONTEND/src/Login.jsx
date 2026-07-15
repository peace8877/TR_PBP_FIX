import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";

// Sesuaikan URL ini dengan alamat server Laravel Anda saat dijalankan (php artisan serve)
const API_BASE_URL = "http://127.0.0.1:8000/api"; 

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("username") || "").trim(); 
    const password = String(formData.get("password") || "").trim();

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ name, password }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Username atau password salah.");
      }

      // Menyimpan token otentikasi & data user ke localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "auth",
        JSON.stringify({
          username: data.user.name,
          role: data.user.role, 
        })
      );

      // Pengalihan halaman berdasarkan role pengguna di database
      if (data.user.role === "admin") {
        navigate("/dashboard");
      } else if (data.user.role === "cashier") {
        navigate("/cashier");
      } else {
        setError("Akses ditolak: Role tidak dikenali.");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mokkaCream p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="h-20 w-20 rounded-3xl bg-white/70 backdrop-blur border border-white/60 shadow-soft flex items-center justify-center mb-4">
            <img src={logo} alt="Caffe Moka Logo" className="h-12 w-12 object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold text-mokkaDark">Caffe Moka</h1>
          <p className="text-gray-500 mt-1">Silakan login untuk melanjutkan</p>
        </div>

        <div className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 shadow-soft p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-600">Username / Nama</label>
              <input
                name="username"
                type="text"
                defaultValue="admin"
                placeholder="Masukkan username..."
                required
                className="mt-2 w-full h-12 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600">Password</label>
              <input
                name="password"
                type="password"
                defaultValue="admin123"
                placeholder="••••••••"
                required
                className="mt-2 w-full h-12 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30 text-sm"
              />
            </div>

            {error ? (
              <div className="text-rose-700 text-xs font-bold bg-white/70 border border-rose-200 rounded-2xl p-3">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 px-5 rounded-2xl bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-extrabold border border-gray-900 transition shadow-lg flex items-center justify-center"
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;