
import logo from "../../assets/logo.png";

function ReceiptModal({ open, onClose, receipt, onPrint }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-white/70 shadow-soft p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Cetak Struk</h3>
              <p className="text-sm text-gray-500 mt-1">Tampilan thermal sederhana</p>
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

          <div className="mt-4 border rounded-2xl p-4 bg-mokkaCream/20">
            <div className="flex items-center justify-center">
              <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
            </div>

            <div className="text-center mt-2">
              <p className="font-extrabold">Cafe Moka</p>
              <p className="text-xs text-gray-600">Jl. Coffee Street No. 12</p>
              <p className="text-xs text-gray-600">No Invoice: {receipt?.invoice}</p>
              <p className="text-xs text-gray-600">Tanggal: {receipt?.date}</p>
              <p className="text-xs text-gray-600">Kasir: {receipt?.cashierName}</p>
            </div>

            <div className="mt-3 border-t border-dashed border-gray-300" />

            <div className="mt-3 space-y-2">
              {(receipt?.items || []).map((it, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900">{it.name}</p>
                    <p className="text-[11px] text-gray-600">Qty: {it.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-gray-900">Rp {it.subtotal.toLocaleString("id-ID")}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 border-t border-dashed border-gray-300" />

            <div className="mt-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-gray-900">Rp {receipt?.totals?.subtotal?.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">PPN</span>
                <span className="font-bold text-gray-900">Rp {receipt?.totals?.ppn?.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-extrabold text-mokkaCoffee">Rp {receipt?.totals?.grandTotal?.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Bayar</span>
                <span className="font-bold text-gray-900">Rp {receipt?.paid?.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Kembali</span>
                <span className="font-bold text-gray-900">Rp {receipt?.change?.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs font-extrabold">Terima kasih telah berkunjung.</p>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onPrint}
              className="flex-1 h-12 rounded-2xl bg-mokkaCoffee text-white font-extrabold hover:bg-mokkaCoffee/90 transition"
            >
              Print
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-28 h-12 rounded-2xl bg-white border border-gray-200 font-extrabold text-gray-800 hover:bg-gray-50 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiptModal;

