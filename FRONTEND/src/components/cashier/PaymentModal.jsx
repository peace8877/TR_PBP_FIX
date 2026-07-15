import { useMemo, useState } from "react";


function PaymentModal({
  open,
  onClose,
  invoice,
  total,
  onConfirm,
}) {
  const [paymentMethod, setPaymentMethod] = useState("Tunai");
  const [paid, setPaid] = useState(0);

  // State resets handled by modal remount (see wrapper key)


  const change = useMemo(() => {
    if (paymentMethod !== "Tunai") return 0;
    const tPaid = Number(paid) || 0;
    const diff = tPaid - total;
    return diff > 0 ? diff : 0;
  }, [paid, paymentMethod, total]);

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
              min={0}
              value={paid}
              onChange={(e) => setPaid(Number(e.target.value))}
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
              onClick={() =>
                onConfirm({ paymentMethod, paid: Number(paid) || 0, change, total })
              }
              className="h-12 px-5 rounded-2xl bg-mokkaCoffee text-white hover:bg-mokkaCoffee/90 font-extrabold"
              disabled={paymentMethod === "Tunai" && (Number(paid) || 0) < total}
            >
              Konfirmasi Pembayaran
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;

