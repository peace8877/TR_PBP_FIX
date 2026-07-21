import { useState, useEffect } from "react";
import { 
  LuBoxes, 
  LuPlus, 
  LuPencil, 
  LuTrash2,
  LuTriangleAlert, 
  LuRefreshCw 
} from "react-icons/lu";

const IngredientsPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    stock_quantity: "",
    unit: "gram", // gram, ml, pcs, kg, dll
  });

  const token = localStorage.getItem("token");

  // Fetch Data Bahan Baku dari API Laravel
  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/ingredients", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const json = await res.json();
      setIngredients(Array.isArray(json?.data) ? json.data : json || []);
    } catch (err) {
      console.error("Gagal mengambil data bahan baku:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // Handle Form Submit (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingItem
      ? `http://127.0.0.1:8000/api/ingredients/${editingItem.id}`
      : "http://127.0.0.1:8000/api/ingredients";

    const method = editingItem ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchIngredients();
        closeModal();
      } else {
        alert("Gagal menyimpan data bahan baku!");
      }
    } catch (err) {
      console.error("Error submit:", err);
    }
  };

  // Handle Hapus Bahan Baku
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus bahan baku ini?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/ingredients/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        fetchIngredients();
      } else {
        alert("Gagal menghapus bahan baku!");
      }
    } catch (err) {
      console.error("Error delete:", err);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        stock_quantity: item.stock_quantity,
        unit: item.unit,
      });
    } else {
      setEditingItem(null);
      setFormData({ name: "", stock_quantity: "", unit: "gram" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Page */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-mokkaCoffee text-white rounded-2xl shadow-soft">
            <LuBoxes className="text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-mokkaDark">Stok Bahan Baku</h1>
            <p className="text-xs text-mokkaCoffee/70 font-medium">
              Kelola persediaan bahan dapur untuk pembuatan menu
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openModal()}
          className="bg-mokkaDark hover:bg-mokkaCoffee text-white font-extrabold px-4 py-2.5 rounded-xl shadow-soft flex items-center gap-2 transition active:scale-95"
        >
          <LuPlus className="text-lg" />
          <span>Tambah Bahan</span>
        </button>
      </div>

      {/* Grid List Stok Bahan Baku */}
      {loading ? (
        <div className="py-12 text-center text-mokkaCoffee flex items-center justify-center gap-2">
          <LuRefreshCw className="animate-spin text-xl" />
          <span className="font-bold">Memuat stok bahan...</span>
        </div>
      ) : ingredients.length === 0 ? (
        <div className="py-16 text-center bg-white/60 rounded-3xl border border-white/60">
          <p className="font-extrabold text-mokkaDark text-lg">Belum ada bahan baku</p>
          <p className="text-xs text-mokkaCoffee/70 mt-1">
            Klik tombol "Tambah Bahan" di atas untuk menambahkan stok awal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients.map((item) => {
            const isLowStock = Number(item.stock_quantity) <= 100; // Threshold stok menipis

            return (
              <div
                key={item.id}
                className="bg-white/80 backdrop-blur-sm border border-white/60 p-5 rounded-3xl shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-mokkaDark text-lg">
                      {item.name}
                    </h3>
                    {isLowStock && (
                      <span className="flex items-center gap-1 bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        <LuTriangleAlert /> Menipis
                      </span>
                    )}
                  </div>

                  <div className="my-4">
                    <span className="text-3xl font-black text-mokkaCoffee">
                      {Number(item.stock_quantity).toLocaleString("id-ID")}
                    </span>
                    <span className="text-sm font-bold text-mokkaCoffee/60 ml-1.5">
                      {item.unit}
                    </span>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => openModal(item)}
                    className="p-2 text-mokkaCoffee hover:bg-mokkaCream rounded-xl transition"
                    title="Edit/Restock"
                  >
                    <LuPencil className="text-lg" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                    title="Hapus"
                  >
                    <LuTrash2 className="text-lg" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form Tambah / Edit Bahan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-white/60 w-full max-w-md p-6">
            <h2 className="text-xl font-extrabold text-mokkaDark mb-4">
              {editingItem ? "Edit / Restock Bahan" : "Tambah Bahan Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-mokkaCoffee/80 mb-1">
                  Nama Bahan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Biji Kopi Arabika, Susu UHT"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm font-semibold text-mokkaDark focus:outline-none focus:ring-2 focus:ring-mokkaCoffee/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-mokkaCoffee/80 mb-1">
                    Jumlah Stok
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="1000"
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock_quantity: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm font-semibold text-mokkaDark focus:outline-none focus:ring-2 focus:ring-mokkaCoffee/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-mokkaCoffee/80 mb-1">
                    Satuan (Unit)
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm font-semibold text-mokkaDark focus:outline-none focus:ring-2 focus:ring-mokkaCoffee/30"
                  >
                    <option value="gram">gram</option>
                    <option value="ml">ml</option>
                    <option value="pcs">pcs</option>
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-mokkaDark hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-mokkaDark text-white text-sm font-bold hover:bg-mokkaCoffee transition shadow-soft"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientsPage;