import { useMemo, useState } from "react";
import axios from "axios";

function PaymentModal({
  open,
  onClose,
  invoice,
  total,
  onConfirm,
  cartItems,
}) {
  const [paymentMethod, setPaymentMethod] = useState("Tunai");
  const [paid, setPaid] = useState(0);
  const [loading, setLoading] = useState(false);

  const change = useMemo(() => {
    if (paymentMethod !== "Tunai") return 0;
    const tPaid = Number(paid) || 0;
    const diff = tPaid - total;
    return diff > 0 ? diff : 0;
  }, [paid, paymentMethod, total]);

  const handleConfirm = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const authString = localStorage.getItem("auth");
    const authData = authString ? JSON.parse(authString) : null;
    const userId = authData?.id ?? authData?.user_id ?? authData?.user?.id;

    if (!userId) {
      alert("Error: user_id tidak ditemukan.");
      setLoading(false);
      return;
    }

    const formattedItems = cartItems.map((item) => ({
        menu_id: Number(item.productId), 
        quantity: Number(item.qty) 
    }));

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/transactions",
        {
          user_id: userId,
          payment_method: paymentMethod,
          tax_amount: 0, 
          items: formattedItems,
        },
        {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json" },
        }
      );

      // Panggil onConfirm hanya setelah API sukses
      if (response.status === 201 || response.status === 200) {
        onConfirm(paid, change); // Kirim data ke dashboard
        onClose();
      }
    } catch (error) {
        alert("Gagal: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-white/70 shadow-soft p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-gray-900">Pembayaran</h3>
              <p className="text-sm text-gray-500 mt-1">Konfirmasi pembayaran transaksi</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-2xl border border-white/70 bg-white/70 hover:bg-white transition"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>

          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-mokkaCream/40 border border-mokkaCoffee/10 p-4">
              <p className="text-xs font-bold text-gray-600">Nomor Invoice</p>
              <p className="text-lg font-extrabold text-mokkaCoffee mt-1">{invoice}</p>
            </div>
            <div className="rounded-2xl bg-mokkaCream/40 border border-mokkaCoffee/10 p-4">
              <p className="text-xs font-bold text-gray-600">Total Tagihan</p>
              <p className="text-lg font-extrabold text-mokkaCoffee mt-1">
                Rp {total.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-bold text-gray-600">Metode pembayaran</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Tunai", "QRIS", "Debit", "E-Wallet"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={[
                    "h-11 rounded-2xl border text-sm font-extrabold transition",
                    paymentMethod === m
                      ? "bg-mokkaCoffee text-white border-mokkaCoffee"
                      : "bg-white/70 border-white/60 text-gray-800 hover:bg-mokkaCoffee/10 hover:text-mokkaCoffee",
                  ].join(" ")}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-bold text-gray-600">Uang bayar</label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0}
              value={paid === 0 ? "" : paid}
              onChange={(e) => {
                const rawValue = e.target.value;
                const cleanValue = rawValue.replace(/^0+/, '');
                setPaid(cleanValue === "" ? 0 : Number(cleanValue));
              }}
              className="mt-2 w-full h-12 rounded-2xl bg-white/80 border border-white/70 px-4 outline-none focus:ring-2 focus:ring-mokkaCoffee/30"
              disabled={paymentMethod !== "Tunai"}
              placeholder={paymentMethod !== "Tunai" ? "Tidak diperlukan" : "Masukkan nominal"}
            />
          </div>

          <div className="mt-3 rounded-2xl bg-white/60 border border-white/70 p-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Kembalian</span>
            <span className="text-lg font-extrabold text-mokkaCoffee">
              Rp {change.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-12 px-5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 font-extrabold text-gray-800"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading || (paymentMethod === "Tunai" && (Number(paid) || 0) < total)}
              className="h-12 px-5 rounded-2xl bg-mokkaCoffee text-white hover:bg-mokkaCoffee/90 font-extrabold"
            >
              {loading ? "Memproses..." : "Konfirmasi Pembayaran"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;