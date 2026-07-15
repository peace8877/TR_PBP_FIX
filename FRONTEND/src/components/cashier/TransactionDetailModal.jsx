

function TransactionDetailModal({ open, onClose, transaction }) {
  if (!open) return null;


  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-3xl border border-white/70 shadow-soft p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-gray-900">Detail Transaksi</h3>
              <p className="text-sm text-gray-500 mt-1">
                Invoice: <span className="font-extrabold">{transaction?.invoice}</span>
              </p>
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

          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-mokkaCream/40 border border-mokkaCoffee/10 p-4">
              <p className="text-xs font-bold text-gray-600">Nama Kasir</p>
              <p className="font-extrabold text-gray-900 mt-1">{transaction?.cashierName}</p>
            </div>
            <div className="rounded-2xl bg-mokkaCream/40 border border-mokkaCoffee/10 p-4">
              <p className="text-xs font-bold text-gray-600">Metode Pembayaran</p>
              <p className="font-extrabold text-gray-900 mt-1">{transaction?.paymentMethod}</p>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-600 bg-white/60 border-b border-white/60">
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Harga</th>
                  <th className="px-4 py-3">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(transaction?.items || []).map((it, idx) => (
                  <tr key={idx} className="border-b border-white/50">
                    <td className="px-4 py-4 font-bold text-gray-900">{it.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-700 font-extrabold">{it.qty}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">Rp {it.price.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-4 text-sm font-extrabold text-mokkaCoffee">
                      Rp {it.subtotal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={4} className="px-4 py-5">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-end gap-2">
                      <div className="w-full sm:w-[420px] rounded-2xl bg-white/60 border border-white/70 p-4">
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <span>Subtotal</span>
                          <span className="text-mokkaCoffee">Rp {transaction?.totals?.subtotal?.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-semibold mt-2">
                          <span>PPN ({Math.round((transaction?.ppnRate || 0) * 100)}%)</span>
                          <span className="text-gray-900">Rp {transaction?.totals?.ppn?.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-semibold mt-2">
                          <span>Diskon</span>
                          <span className="text-rose-600">- Rp {transaction?.totals?.discount?.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="border-t border-white/70 my-3" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-extrabold">Total</span>
                          <span className="text-lg font-extrabold text-mokkaCoffee">
                            Rp {transaction?.totals?.grandTotal?.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-12 px-5 rounded-2xl bg-mokkaCoffee text-white hover:bg-mokkaCoffee/90 font-extrabold"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailModal;

