function ReceiptModal({ open, onClose, invoice, total, cartItems = [], paid = 0, change = 0, onPrint }) {
  if (!open) return null;

  // Pastikan perhitungan aman dengan fallback 0
  const subtotal = cartItems.reduce((acc, it) => acc + (Number(it.price) * Number(it.qty)), 0);
  const ppn = subtotal * 0.1;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/30">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl">
        <div className="text-center">
          <h3 className="font-extrabold text-lg">Cafe Moka</h3>
          <p className="text-xs text-gray-500">Invoice: {invoice || "-"}</p>
        </div>

        <div className="mt-4 border-t border-dashed py-3 space-y-2">
          {cartItems.map((it, idx) => (
            <div key={idx} className="flex justify-between text-xs">
              <span>{it.name} (x{it.qty})</span>
              <span>Rp {(Number(it.price) * Number(it.qty)).toLocaleString("id-ID")}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed pt-3 text-xs space-y-1">
          <div className="flex justify-between"><span>Subtotal</span><span>Rp {subtotal.toLocaleString("id-ID")}</span></div>
          <div className="flex justify-between"><span>PPN 10%</span><span>Rp {ppn.toLocaleString("id-ID")}</span></div>
          <div className="flex justify-between font-bold text-base mt-2">
            <span>Total</span>
            <span>Rp {Number(total || 0).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between mt-4"><span>Bayar</span><span>Rp {Number(paid || 0).toLocaleString("id-ID")}</span></div>
          <div className="flex justify-between"><span>Kembali</span><span>Rp {Number(change || 0).toLocaleString("id-ID")}</span></div>
        </div>

        <div className="mt-6 flex gap-2">
          <button onClick={onPrint} className="flex-1 bg-black text-white h-10 rounded-xl font-bold">Print</button>
          <button onClick={onClose} className="flex-1 bg-gray-100 h-10 rounded-xl font-bold">Tutup</button>
        </div>
      </div>
    </div>
  );
}
export default ReceiptModal;