import CartItem from "./CartItem";


function Cart({ items, onIncrease, onDecrease, onRemove, totals, onPay, onClear }) {
  return (
    <div className="rounded-3xl bg-white/70 border border-white/60 shadow-sm p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-extrabold text-gray-900">Keranjang</h3>
        <p className="text-sm text-gray-500 mt-1">{items.length ? `${items.length} item` : "Kosong"}</p>
      </div>

      <div className="flex-1 overflow-auto pr-1">
        <div className="flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="py-10 text-center text-gray-500 text-sm font-semibold">
              Mulai tambah produk di tengah.
            </div>
          ) : (
            items.map((it) => (
              <CartItem
                key={it.productId}
                item={it}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onRemove={onRemove}
              />
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white/60 border border-white/70 p-4">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Subtotal</span>
          <span className="text-mokkaCoffee">Rp {totals.subtotal.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex items-center justify-between text-sm font-semibold mt-2">
          <span>PPN 10%</span>
          <span className="text-gray-900">Rp {totals.ppn.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex items-center justify-between text-sm font-semibold mt-2">
          <span>Diskon</span>
          <span className={totals.discount > 0 ? "text-rose-600" : "text-gray-500"}>
            - Rp {totals.discount.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="border-t border-white/70 my-3" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-extrabold">Total</span>
          <span className="text-lg font-extrabold text-mokkaCoffee">
            Rp {totals.total.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPay}
          disabled={items.length === 0}
          className="flex-1 h-12 rounded-2xl bg-mokkaCoffee text-white font-extrabold hover:bg-mokkaCoffee/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Bayar
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={items.length === 0}
          className="h-12 w-32 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-extrabold hover:bg-rose-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Kosongkan
        </button>
      </div>
    </div>
  );
}

export default Cart;

