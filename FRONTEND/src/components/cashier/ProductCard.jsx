function ProductCard({ product, onAdd }) {
  return (
    <div className="rounded-xl bg-white/70 border border-white/60 shadow-sm hover:shadow-soft transition duration-300 overflow-hidden">
      <div className="p-3">
        <div className="rounded-lg overflow-hidden bg-white/60 border border-white/60">
          <img
            src={product.image}
            alt={product.name}
            className="h-28 w-full object-cover"
          />
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {product.name}
            </p>
            <p className="text-sm font-extrabold text-mokkaCoffee mt-1">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAdd(product)}
            className="h-10 w-10 rounded-xl bg-mokkaCoffee text-white hover:bg-mokkaCoffee/90 transition duration-300 flex items-center justify-center font-extrabold"
            aria-label={`Tambah ${product.name}`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

