import { useState, useEffect } from "react";
import { LuPlus, LuTrash2, LuX } from "react-icons/lu";

const ProductFormModal = ({ open, onClose, onSave, productToEdit = null }) => {
  const [categories, setCategories] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  
  // Form State
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [recipe, setRecipe] = useState([]); // List resep [{ ingredient_id, quantity_needed }]

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (open) {
      fetchCategoriesAndIngredients();
      
      if (productToEdit) {
        setName(productToEdit.name || "");
        setCategoryId(productToEdit.category_id || "");
        setPrice(productToEdit.price || "");
        
        // Memetakan bahan baku jika menu sudah punya resep
        if (productToEdit.ingredients) {
          const formattedRecipe = productToEdit.ingredients.map((ing) => ({
            ingredient_id: ing.id,
            quantity_needed: ing.pivot?.quantity_needed || 0,
          }));
          setRecipe(formattedRecipe);
        }
      } else {
        // Form Kosong untuk Tambah Menu Baru
        setName("");
        setCategoryId("");
        setPrice("");
        setRecipe([]);
      }
    }
  }, [open, productToEdit]);

  const fetchCategoriesAndIngredients = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };
      const [catRes, ingRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/categories", { headers }),
        fetch("http://127.0.0.1:8000/api/ingredients", { headers }),
      ]);
      const catJson = await catRes.json();
      const ingJson = await ingRes.json();

      setCategories(catJson?.data || []);
      setAllIngredients(ingJson?.data || []);
    } catch (err) {
      console.error("Gagal mengambil master data:", err);
    }
  };

  // 1. Tambah baris resep baru
  const addRecipeRow = () => {
    setRecipe([...recipe, { ingredient_id: "", quantity_needed: 1 }]);
  };

  // 2. Ubah data resep
  const updateRecipeRow = (index, field, value) => {
    const newRecipe = [...recipe];
    newRecipe[index][field] = value;
    setRecipe(newRecipe);
  };

  // 3. Hapus baris resep
  const removeRecipeRow = (index) => {
    setRecipe(recipe.filter((_, i) => i !== index));
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name,
      category_id: categoryId,
      price: Number(price),
      is_available: true,
      // Format payload bahan baku sesuai Laravel Controller
      ingredients: recipe
        .filter((r) => r.ingredient_id && r.quantity_needed > 0)
        .map((r) => ({
          ingredient_id: Number(r.ingredient_id),
          quantity_needed: Number(r.quantity_needed),
        })),
    };

    onSave(payload);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border border-white/60 w-full max-w-lg p-6 max-h-[90vh] flex flex-col justify-between">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-lg font-black text-mokkaDark">
            {productToEdit ? "Edit Menu & Resep" : "Tambah Menu & Resep"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <LuX className="text-xl text-mokkaCoffee" />
          </button>
        </div>

        {/* Form Body */}
        <form id="productForm" onSubmit={handleSubmit} className="space-y-4 overflow-y-auto my-4 pr-1">
          <div>
            <label className="block text-xs font-bold text-mokkaCoffee/80 mb-1">Nama Menu</label>
            <input
              type="text"
              required
              placeholder="Misal: Latte Coffee"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-mokkaDark focus:ring-2 focus:ring-mokkaCoffee/30 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-mokkaCoffee/80 mb-1">Kategori</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-mokkaDark focus:ring-2 focus:ring-mokkaCoffee/30 outline-none"
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-mokkaCoffee/80 mb-1">Harga (Rp)</label>
              <input
                type="number"
                required
                placeholder="25000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-mokkaDark focus:ring-2 focus:ring-mokkaCoffee/30 outline-none"
              />
            </div>
          </div>

          {/* SEKSI RESEP / BAHAN BAKU */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-mokkaDark uppercase tracking-wider">
                Resep / Komposisi Bahan
              </label>
              <button
                type="button"
                onClick={addRecipeRow}
                className="text-xs font-bold text-mokkaCoffee hover:underline flex items-center gap-1"
              >
                <LuPlus /> Tambah Bahan
              </button>
            </div>

            <div className="space-y-2">
              {recipe.length === 0 ? (
                <p className="text-xs text-mokkaCoffee/50 italic py-2">
                  Belum ada bahan baku yang ditautkan ke menu ini.
                </p>
              ) : (
                recipe.map((row, index) => {
                  const selectedIng = allIngredients.find((i) => String(i.id) === String(row.ingredient_id));

                  return (
                    <div key={index} className="flex items-center gap-2 bg-mokkaCream/40 p-2 rounded-xl border border-white">
                      {/* Select Bahan */}
                      <select
                        required
                        value={row.ingredient_id}
                        onChange={(e) => updateRecipeRow(index, "ingredient_id", e.target.value)}
                        className="flex-1 p-2 rounded-lg border text-xs font-bold text-mokkaDark"
                      >
                        <option value="">Pilih Bahan</option>
                        {allIngredients.map((ing) => (
                          <option key={ing.id} value={ing.id}>
                            {ing.name} ({ing.unit})
                          </option>
                        ))}
                      </select>

                      {/* Jumlah Kebutuhan */}
                      <div className="flex items-center gap-1 w-28">
                        <input
                          type="number"
                          step="any"
                          required
                          placeholder="Qty"
                          value={row.quantity_needed}
                          onChange={(e) => updateRecipeRow(index, "quantity_needed", e.target.value)}
                          className="w-full p-2 rounded-lg border text-xs font-bold text-mokkaDark text-center"
                        />
                        <span className="text-[10px] font-bold text-mokkaCoffee">
                          {selectedIng?.unit || ""}
                        </span>
                      </div>

                      {/* Hapus Baris */}
                      <button
                        type="button"
                        onClick={() => removeRecipeRow(index)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <LuTrash2 />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </form>

        {/* Footer Modal */}
        <div className="flex justify-end gap-3 pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border text-xs font-bold text-mokkaDark"
          >
            Batal
          </button>
          <button
            type="submit"
            form="productForm"
            className="px-4 py-2 rounded-xl bg-mokkaDark text-white text-xs font-bold hover:bg-mokkaCoffee transition shadow-soft"
          >
            Simpan Menu
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductFormModal;