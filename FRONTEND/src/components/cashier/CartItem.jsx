function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-white/70 border border-white/60">
      <div className="min-w-0">
        <p className="font-extrabold text-sm text-gray-900 truncate">{item.name}</p>
        <p className="text-sm font-extrabold text-mokkaCoffee mt-1">
          Rp {item.price.toLocaleString("id-ID")}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDecrease(item)}
            className="h-9 w-9 rounded-xl bg-mokkaCream border border-mokkaCoffee/10 text-mokkaCoffee font-extrabold hover:bg-mokkaCream/80 transition"
            aria-label={`Kurangi ${item.name}`}
          >
            -
          </button>
          <span className="w-8 text-center font-extrabold text-gray-900">
            {item.qty}
          </span>
          <button
            type="button"
            onClick={() => onIncrease(item)}
            className="h-9 w-9 rounded-xl bg-mokkaCoffee text-white font-extrabold hover:bg-mokkaCoffee/90 transition"
            aria-label={`Tambah ${item.name}`}
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item)}
          className="text-xs font-bold text-rose-600 hover:text-rose-700"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;

